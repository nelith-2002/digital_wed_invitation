"use client";

import Image from "next/image";
import IconixCodeCredit from "@/components/common/IconixCodeCredit";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type EventType = "wedding" | "homecoming";

type UploadStatus =
  | "waiting"
  | "uploading"
  | "success"
  | "error";

type UploadItem = {
  id: string;
  file: File;
  preview: string | null;
  progress: number;
  status: UploadStatus;
  error?: string;
};

type MomentsUploaderProps = {
  event: EventType;
};

const MAX_FILE_SIZE = 500 * 1024 * 1024;

/*
  Google Drive resumable upload chunks must use
  multiples of 256 KB, except for the final chunk.

  Small files use smaller chunks so guests can actually
  see meaningful progress. Large videos keep larger chunks
  to avoid creating unnecessary requests.
*/
const DRIVE_CHUNK_UNIT = 256 * 1024;
const FALLBACK_CHUNK_SIZE = 16 * DRIVE_CHUNK_UNIT; // 4 MB
const MAX_CONCURRENT_UPLOADS = 2;
const MAX_RETRIES = 3;
const COMPLETION_VISIBLE_MS = 650;

function getChunkSize() {
  return FALLBACK_CHUNK_SIZE;
}

export default function MomentsUploader({
  event,
}: MomentsUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /*
    Keep track of preview URLs separately so we can
    safely revoke them when files are removed/reset.
  */
  const previewUrlsRef = useRef<Set<string>>(new Set());

  /*
    Keep the screen awake while uploads are active on browsers
    that support the Screen Wake Lock API. Unsupported browsers
    simply continue normally.
  */
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  const isWedding = event === "wedding";

  const title = isWedding
    ? "Share Our Wedding Moments"
    : "Share Our Homecoming Moments";

  const subtitle = isWedding
    ? "Help us keep the beautiful moments you captured from our wedding."
    : "Help us keep the beautiful moments you captured from our homecoming.";

  /*
    Keep the connection indicator in sync with the browser.
    These listeners do not interfere with the upload/retry logic;
    they only give guests clearer feedback.
  */
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  /*
    Warn guests if they try to refresh, close, or navigate away
    while an upload is active. Modern browsers display their own
    generic confirmation message.
  */
  useEffect(() => {
    if (!isUploading) {
      return;
    }

    function handleBeforeUnload(
      event: BeforeUnloadEvent
    ) {
      event.preventDefault();

      /*
        Keep this assignment for browsers that still use the
        legacy returnValue signal. Browsers control the visible
        wording of the confirmation dialog.
      */
      event.returnValue =
        "Uploads are still in progress.";
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isUploading]);

  /*
    Keep supported phones/tablets awake only while uploads are
    active. This is progressive enhancement: if Wake Lock is not
    available or the device refuses it (for example, low battery),
    uploads continue normally.
  */
  useEffect(() => {
    if (!isUploading) {
      return;
    }

    let cancelled = false;

    async function requestWakeLock() {
      if (
        !("wakeLock" in navigator) ||
        document.visibilityState !==
          "visible"
      ) {
        return;
      }

      try {
        const sentinel =
          await navigator.wakeLock.request(
            "screen"
          );

        if (cancelled) {
          await sentinel.release();
          return;
        }

        wakeLockRef.current =
          sentinel;

        setIsWakeLockActive(
          true
        );

        sentinel.addEventListener(
          "release",
          () => {
            if (!cancelled) {
              setIsWakeLockActive(
                false
              );
            }
          }
        );
      } catch {
        /*
          Wake Lock is optional. Never interrupt or fail an upload
          because the browser/device did not grant it.
        */
        setIsWakeLockActive(
          false
        );
      }
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState ===
          "visible" &&
        !wakeLockRef.current
      ) {
        void requestWakeLock();
      }
    }

    void requestWakeLock();

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      cancelled = true;

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      const currentWakeLock =
        wakeLockRef.current;

      wakeLockRef.current =
        null;

      setIsWakeLockActive(
        false
      );

      if (
        currentWakeLock &&
        !currentWakeLock.released
      ) {
        void currentWakeLock.release();
      }
    };
  }, [isUploading]);

  const overallProgress = useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    const totalProgress = items.reduce(
      (sum, item) => sum + item.progress,
      0
    );

    /*
      Use floor instead of round so an average such as 99.5%
      never displays as 100% while one or more files are still
      uploading. 100% is reserved for the moment every file has
      actually reached the success state.
    */
    const averageProgress = Math.floor(
      totalProgress / items.length
    );

    const everyItemSucceeded =
      items.every(
        (item) =>
          item.status === "success"
      );

    return everyItemSucceeded
      ? 100
      : Math.min(
          99,
          averageProgress
        );
  }, [items]);

  const successfulCount = items.filter(
    (item) => item.status === "success"
  ).length;

  const failedCount = items.filter(
    (item) => item.status === "error"
  ).length;

  const allSuccessful =
    items.length > 0 &&
    successfulCount === items.length &&
    !isUploading;

  function createUploadItem(
    file: File
  ): UploadItem {
    let preview: string | null = null;

    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);

      previewUrlsRef.current.add(preview);
    }

    return {
      id: crypto.randomUUID(),
      file,
      preview,
      progress: 0,
      status: "waiting",
    };
  }

  function validateFiles(files: File[]) {
    const accepted: File[] = [];
    const rejected: string[] = [];

    for (const file of files) {
      const isSupported =
        file.type.startsWith("image/") ||
        file.type.startsWith("video/");

      if (!isSupported) {
        rejected.push(
          `${file.name}: only photos and videos can be uploaded.`
        );

        continue;
      }

      if (file.size <= 0) {
        rejected.push(
          `${file.name}: this file appears to be empty.`
        );

        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        rejected.push(
          `${file.name}: this file is larger than the 500 MB limit.`
        );

        continue;
      }

      accepted.push(file);
    }

    return {
      accepted,
      rejected,
    };
  }

  function addFiles(files: File[]) {
    const {
      accepted,
      rejected,
    } = validateFiles(files);

    if (accepted.length > 0) {
      const newItems =
        accepted.map(createUploadItem);

      setItems((current) => [
        ...current,
        ...newItems,
      ]);
    }

    if (rejected.length > 0) {
      setGlobalMessage(
        rejected.join(" ")
      );
    } else {
      setGlobalMessage("");
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    addFiles(selectedFiles);

    /*
      Reset the native input so the same file can
      be selected again later if necessary.
    */
    event.target.value = "";
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    if (!isUploading) {
      setDragActive(true);
    }
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragActive(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragActive(false);

    if (isUploading) {
      return;
    }

    const droppedFiles =
      Array.from(
        event.dataTransfer.files
      );

    addFiles(droppedFiles);
  }

  function removeItem(id: string) {
    if (isUploading) {
      return;
    }

    setItems((current) => {
      const target = current.find(
        (item) => item.id === id
      );

      if (target?.preview) {
        URL.revokeObjectURL(
          target.preview
        );

        previewUrlsRef.current.delete(
          target.preview
        );
      }

      return current.filter(
        (item) => item.id !== id
      );
    });

    setGlobalMessage("");
  }

  function updateItem(
    id: string,
    update: Partial<UploadItem>
  ) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        /*
          Upload progress must never move backwards during the
          same upload/retry cycle. A direct Google upload may fail
          after the browser has already sent many bytes and then
          switch to the safe server fallback. Without this guard,
          that fallback can visually reset a file from e.g. 78%
          back to 0%, which also makes the overall bar jump down.

          Keep the highest progress already shown to the guest.
          New files/reset-after-success still naturally start at 0
          because they are created as new UploadItem objects.
        */
        const nextProgress =
          typeof update.progress ===
          "number"
            ? Math.max(
                item.progress,
                Math.min(
                  100,
                  Math.max(
                    0,
                    update.progress
                  )
                )
              )
            : item.progress;

        return {
          ...item,
          ...update,
          progress:
            nextProgress,
        };
      })
    );
  }

  async function createUploadSession(
    file: File
  ) {
    let response: Response;

    try {
      response = await fetch(
        "/api/moments/upload-session",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            event,
            fileName: file.name,
            mimeType:
              file.type ||
              "application/octet-stream",
            fileSize: file.size,
          }),
        }
      );
    } catch {
      throw new Error(
        getConnectionErrorMessage()
      );
    }

    let data: {
      success?: boolean;
      uploadUrl?: string;
      message?: string;
    };

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "We couldn't prepare this upload. Please try again."
      );
    }

    if (
      !response.ok ||
      !data.success ||
      !data.uploadUrl
    ) {
      throw new Error(
        data.message ||
          "We couldn't prepare this upload. Please try again."
      );
    }

    return data.uploadUrl;
  }

  async function uploadViaServerFallback(
    file: File,
    itemId: string
  ) {
    const uploadUrl = await createUploadSession(file);
    let offset = 0;
    const chunkSize = getChunkSize();

    while (offset < file.size) {
      const nextOffset = Math.min(offset + chunkSize, file.size);
      const result = await sendChunk(
        uploadUrl,
        file,
        offset,
        nextOffset,
        itemId
      );

      offset = nextOffset;

      updateItem(itemId, {
        progress: Math.min(
          99,
          Math.round((offset / file.size) * 100)
        ),
      });

      if (result.complete) {
        return true;
      }
    }

    return false;
  }

  async function sendChunk(
    uploadUrl: string,
    file: File,
    start: number,
    end: number,
    itemId: string
  ) {
    const chunk = file.slice(start, end);

    const contentRange =
      `bytes ${start}-${end - 1}/${file.size}`;

    let lastError: unknown;

    for (
      let attempt = 1;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      try {
        if (
          typeof navigator !== "undefined" &&
          !navigator.onLine
        ) {
          throw new Error(
            "Your internet connection is offline."
          );
        }

        const result =
          await uploadChunkWithProgress({
            uploadUrl,
            chunk,
            contentRange,
            mimeType:
              file.type ||
              "application/octet-stream",

            onProgress: (
              uploadedChunkBytes
            ) => {
              const totalUploaded =
                Math.min(
                  start +
                    uploadedChunkBytes,
                  file.size
                );

              /*
                Keep 100% reserved until the server/Google Drive
                confirms completion. This means the guest sees
                true byte-level progress while the file is moving.
              */
              const progress =
                Math.min(
                  99,
                  Math.max(
                    1,
                    Math.round(
                      (
                        totalUploaded /
                        file.size
                      ) * 100
                    )
                  )
                );

              updateItem(
                itemId,
                {
                  progress,
                }
              );
            },
          });

        return result;
      } catch (error) {
        lastError = error;

        if (
          typeof navigator !== "undefined" &&
          !navigator.onLine
        ) {
          break;
        }

        if (
          attempt < MAX_RETRIES
        ) {
          /*
            Keep the visible high-water mark while retrying.
            Progress callbacks from the retried chunk are also
            protected by updateItem(), so neither the individual
            bar nor the overall bar can move backwards.
          */
          await sleep(
            750 * 2 ** (attempt - 1)
          );
        }
      }
    }

    if (
      typeof navigator !== "undefined" &&
      !navigator.onLine
    ) {
      throw new Error(
        "Your internet connection appears to be offline. Reconnect and tap Retry Remaining Uploads."
      );
    }

    throw lastError instanceof Error
      ? lastError
      : new Error(
          "The upload connection was interrupted. Please try again."
        );
  }

  async function uploadOneItem(
    item: UploadItem
  ) {
    const { id, file } = item;

    updateItem(id, {
      status: "uploading",
      progress: 0,
      error: undefined,
    });

    try {
      /*
        Use the reliable resumable upload path directly.

        The browser sends 4 MB chunks to our existing upload-chunk
        endpoint, which forwards them to the Google Drive resumable
        session. This avoids the repeatedly failing browser -> Google
        direct request while preserving:
        - resumable uploads,
        - accurate byte-level progress,
        - retries,
        - two-file concurrency,
        - original file quality.
      */
      const completed =
        await uploadViaServerFallback(
          file,
          id
        );

      if (!completed) {
        throw new Error(
          "The upload finished sending, but Google Drive did not confirm the file. Please retry this file."
        );
      }

      /*
        Only show 100% once Google Drive has actually confirmed
        the file. This keeps the individual and overall progress
        indicators consistent.
      */
      updateItem(id, {
        status: "success",
        progress: 100,
        error: undefined,
      });

      await sleep(
        COMPLETION_VISIBLE_MS
      );

      return true;
    } catch (error) {
      let message =
        "We couldn't upload this file. Please try again.";

      if (
        typeof navigator !== "undefined" &&
        !navigator.onLine
      ) {
        message =
          "Your internet connection appears to be offline. Reconnect and tap Retry Remaining Uploads.";
      } else if (
        error instanceof Error
      ) {
        message =
          error.message;
      }

      updateItem(id, {
        status: "error",
        error: message,
      });

      return false;
    }
  }

  async function uploadAll() {
    if (isUploading) {
      return;
    }

    const pendingItems =
      items.filter(
        (item) =>
          item.status ===
            "waiting" ||
          item.status ===
            "error"
      );

    if (
      pendingItems.length === 0
    ) {
      return;
    }

    if (
      typeof navigator !==
        "undefined" &&
      !navigator.onLine
    ) {
      setGlobalMessage(
        "You appear to be offline. Please reconnect to the internet before uploading."
      );

      return;
    }

    setIsUploading(true);
    setGlobalMessage("");

    let uploadFailures = 0;

    try {
      let nextItemIndex = 0;

      async function uploadWorker() {
        while (nextItemIndex < pendingItems.length) {
          const currentIndex = nextItemIndex++;
          const item = pendingItems[currentIndex];
          const succeeded = await uploadOneItem(item);

          if (!succeeded) {
            uploadFailures++;
          }
        }
      }

      const workerCount = Math.min(
        MAX_CONCURRENT_UPLOADS,
        pendingItems.length
      );

      await Promise.all(
        Array.from({ length: workerCount }, () => uploadWorker())
      );

      if (
        uploadFailures > 0
      ) {
        setGlobalMessage(
          uploadFailures === 1
            ? "One memory could not be uploaded. Your other uploads are safe. Check the failed file below and tap Retry Remaining Uploads."
            : `${uploadFailures} memories could not be uploaded. Your completed uploads are safe. Check the failed files below and tap Retry Remaining Uploads.`
        );
      }
    } finally {
      setIsUploading(false);
    }
  }

  function resetAfterSuccess() {
    previewUrlsRef.current.forEach(
      (previewUrl) => {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    );

    previewUrlsRef.current.clear();

    setItems([]);
    setGlobalMessage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <main
      className={`momentsPage ${
        isWedding
          ? "momentsWedding"
          : "momentsHomecoming"
      }`}
    >
      <div
        className="momentsBackdrop momentsBackdropOne"
        aria-hidden="true"
      />

      <div
        className="momentsBackdrop momentsBackdropTwo"
        aria-hidden="true"
      />

      <section className="momentsShell">
        <header className="momentsHeader">
          {/* SAME LR LOGO USED BY THE DASHBOARD */}
          <div className="momentsLogoWrap">
            <Image
              src="/brand/lr-logo.png"
              alt="Rahal and Lalisha logo"
              width={64}
              height={64}
              className="momentsLogo"
              priority
            />
          </div>

          <p className="momentsEyebrow">
            RAHAL &amp; LALISHA
          </p>

          <h1>
            {title}
          </h1>

          <p className="momentsIntro">
            {subtitle}
          </p>

          <div
            className="momentsHeaderDivider"
            aria-hidden="true"
          >
            <span />

            <strong>
              ◇
            </strong>

            <span />
          </div>
        </header>

        {allSuccessful ? (
          <div className="momentsSuccess">
            <div
              className="momentsSuccessIcon"
              aria-hidden="true"
            >
              ✓
            </div>

            <p className="momentsSuccessEyebrow">
              MEMORIES RECEIVED
            </p>

            <h2>
              Thank You
            </h2>

            <p>
              Your{" "}
              {items.length === 1
                ? "memory has"
                : "memories have"}{" "}
              been safely received.
            </p>

            <p className="momentsSuccessSmall">
              Thank you for helping us
              remember this beautiful
              day from your point of
              view.
            </p>

            <button
              type="button"
              className="momentsPrimaryButton"
              onClick={
                resetAfterSuccess
              }
            >
              Share More Memories
            </button>
          </div>
        ) : (
          <>
            <div
              className={`momentsDropzone ${
                dragActive
                  ? "momentsDropzoneActive"
                  : ""
              }`}
              onDragOver={
                handleDragOver
              }
              onDragLeave={
                handleDragLeave
              }
              onDrop={
                handleDrop
              }
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                disabled={
                  isUploading
                }
                onChange={
                  handleFileChange
                }
                className="momentsHiddenInput"
              />

              <div
                className="momentsUploadIcon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2>
                Add your photos
                &amp; videos
              </h2>

              <p>
                Select one or several
                memories from your
                phone.
              </p>

              <button
                type="button"
                className="momentsSelectButton"
                disabled={
                  isUploading
                }
                onClick={() =>
                  inputRef.current?.click()
                }
              >
                Choose Photos &amp;
                Videos
              </button>

              <p className="momentsDropHint">
                Photos or videos · up
                to 500 MB each
              </p>
            </div>

            <div
              className={`momentsGuestAssurance ${
                isOnline
                  ? "momentsGuestAssuranceOnline"
                  : "momentsGuestAssuranceOffline"
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="momentsGuestAssuranceItem">
                <span
                  className="momentsGuestAssuranceDot"
                  aria-hidden="true"
                />

                <p>
                  {isOnline
                    ? "Internet connection ready"
                    : "You are offline — reconnect before uploading"}
                </p>
              </div>

              <div className="momentsGuestAssuranceItem">
                <span
                  className="momentsGuestAssuranceShield"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <p>
                  Your memories are shared privately with Rahal &amp; Lalisha.
                </p>
              </div>
            </div>

            {globalMessage && (
              <div
                className="momentsGlobalError"
                role="alert"
                aria-live="polite"
              >
                {globalMessage}
              </div>
            )}

            {items.length > 0 && (
              <section className="momentsQueue">
                <div className="momentsQueueHeader">
                  <div>
                    <p className="momentsQueueEyebrow">
                      READY TO SHARE
                    </p>

                    <h2>
                      {items.length}{" "}
                      {items.length ===
                      1
                        ? "memory"
                        : "memories"}
                    </h2>
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      className="momentsAddMore"
                      onClick={() =>
                        inputRef.current?.click()
                      }
                    >
                      + Add more
                    </button>
                  )}
                </div>

                <div className="momentsFileList">
                  {items.map(
                    (item) => (
                      <article
                        className="momentsFileCard"
                        key={
                          item.id
                        }
                      >
                        <div className="momentsFilePreview">
                          {item.preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                item.preview
                              }
                              alt=""
                            />
                          ) : (
                            <div
                              className="momentsVideoPreview"
                              aria-hidden="true"
                            >
                              <span>
                                ▶
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="momentsFileInfo">
                          <div className="momentsFileTop">
                            <div>
                              <p className="momentsFileName">
                                {
                                  item
                                    .file
                                    .name
                                }
                              </p>

                              <p className="momentsFileMeta">
                                {formatFileSize(
                                  item
                                    .file
                                    .size
                                )}

                                {" · "}

                                {item.file.type.startsWith(
                                  "video/"
                                )
                                  ? "Video"
                                  : "Photo"}
                              </p>
                            </div>

                            {!isUploading &&
                              item.status !==
                                "success" && (
                                <button
                                  type="button"
                                  className="momentsRemoveButton"
                                  onClick={() =>
                                    removeItem(
                                      item.id
                                    )
                                  }
                                  aria-label={`Remove ${item.file.name}`}
                                >
                                  ×
                                </button>
                              )}
                          </div>

                          <div className="momentsFileStatusRow">
                            <span
                              className={`momentsStatus momentsStatus-${item.status}`}
                            >
                              {getStatusLabel(
                                item.status
                              )}
                            </span>

                            <span>
                              {
                                item.progress
                              }
                              %
                            </span>
                          </div>

                          <div className="momentsProgressTrack">
                            <div
                              className="momentsProgressFill"
                              style={{
                                width:
                                  `${item.progress}%`,
                              }}
                            />
                          </div>

                          {item.error && (
                            <p
                              className="momentsFileError"
                              role="alert"
                            >
                              {
                                item.error
                              }
                            </p>
                          )}
                        </div>
                      </article>
                    )
                  )}
                </div>

                <div className="momentsOverall">
                  <div>
                    <span>
                      Overall progress
                    </span>

                    <strong>
                      {overallProgress}
                      %
                    </strong>
                  </div>

                  <div className="momentsOverallTrack">
                    <div
                      className={`momentsOverallFill ${
                        overallProgress ===
                        0
                          ? "momentsOverallFillEmpty"
                          : ""
                      }`}
                      style={{
                        width:
                          `${overallProgress}%`,
                      }}
                    />
                  </div>

                  {(successfulCount >
                    0 ||
                    failedCount >
                      0) && (
                    <p>
                      {
                        successfulCount
                      }{" "}
                      uploaded
                      {failedCount >
                      0
                        ? ` · ${failedCount} need retry`
                        : ""}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="momentsPrimaryButton"
                  disabled={
                    isUploading ||
                    items.length ===
                      0
                  }
                  onClick={
                    uploadAll
                  }
                >
                  {isUploading
                    ? `Uploading ${overallProgress}%`
                    : failedCount >
                        0
                      ? "Retry Remaining Uploads"
                      : `Share ${
                          items.length
                        } ${
                          items.length ===
                          1
                            ? "Memory"
                            : "Memories"
                        }`}
                </button>

                <div className="momentsSafety">
                  <span
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p>
                    Keep this page
                    open until every
                    upload is
                    complete.
                    {isWakeLockActive
                      ? " Your screen will stay awake while uploading."
                      : ""}
                  </p>
                </div>
              </section>
            )}
          </>
        )}

        {/* SAME SHARED ICONIXCODE CREDIT
            USED BY DASHBOARD / WEDDING / HOMECOMING */}
        <footer className="momentsFooter">
          <IconixCodeCredit
            variant={
              isWedding
                ? "default"
                : "homecoming"
            }
          />
        </footer>
      </section>
    </main>
  );
}


function uploadChunkWithProgress({
  uploadUrl,
  chunk,
  contentRange,
  mimeType,
  onProgress,
}: {
  uploadUrl: string;
  chunk: Blob;
  contentRange: string;
  mimeType: string;
  onProgress: (
    uploadedBytes: number
  ) => void;
}) {
  return new Promise<{
    success?: boolean;
    complete?: boolean;
    message?: string;
  }>((resolve, reject) => {
    const xhr =
      new XMLHttpRequest();

    xhr.open(
      "POST",
      "/api/moments/upload-chunk"
    );

    xhr.setRequestHeader(
      "Content-Type",
      "application/octet-stream"
    );

    xhr.setRequestHeader(
      "x-upload-url",
      uploadUrl
    );

    xhr.setRequestHeader(
      "x-content-range",
      contentRange
    );

    xhr.setRequestHeader(
      "x-file-type",
      mimeType
    );

    xhr.upload.addEventListener(
      "progress",
      (event) => {
        if (
          event.lengthComputable
        ) {
          onProgress(
            event.loaded
          );
        }
      }
    );

    xhr.addEventListener(
      "load",
      () => {
        let data: {
          success?: boolean;
          complete?: boolean;
          message?: string;
        };

        try {
          data = JSON.parse(
            xhr.responseText
          );
        } catch {
          reject(
            new Error(
              "The upload server returned an unexpected response."
            )
          );

          return;
        }

        if (
          xhr.status >= 200 &&
          xhr.status < 300 &&
          data.success
        ) {
          resolve(data);

          return;
        }

        reject(
          new Error(
            data.message ||
              "Part of the upload could not be completed."
          )
        );
      }
    );

    xhr.addEventListener(
      "error",
      () => {
        reject(
          new Error(
            "The upload connection was interrupted. Please check your internet connection and try again."
          )
        );
      }
    );

    xhr.addEventListener(
      "abort",
      () => {
        reject(
          new Error(
            "The upload was cancelled before it finished."
          )
        );
      }
    );

    xhr.addEventListener(
      "timeout",
      () => {
        reject(
          new Error(
            "The upload took too long to respond. Please try again."
          )
        );
      }
    );

    /*
      Ten minutes applies to a single chunk rather than the
      whole video, which is safer for slower mobile networks.
    */
    xhr.timeout =
      10 * 60 * 1000;

    xhr.send(chunk);
  });
}

function formatFileSize(
  bytes: number
) {
  if (
    bytes <
    1024 * 1024
  ) {
    return `${Math.max(
      1,
      Math.round(
        bytes / 1024
      )
    )} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}

function getStatusLabel(
  status: UploadStatus
) {
  switch (status) {
    case "uploading":
      return "Uploading";

    case "success":
      return "Uploaded";

    case "error":
      return "Needs retry";

    default:
      return "Ready";
  }
}

function getConnectionErrorMessage() {
  if (
    typeof navigator !==
      "undefined" &&
    !navigator.onLine
  ) {
    return "Your internet connection appears to be offline. Please reconnect and try again.";
  }

  return "We couldn't connect to the upload service. Please check your connection and try again.";
}

function sleep(
  milliseconds: number
) {
  return new Promise<void>(
    (resolve) => {
      window.setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}