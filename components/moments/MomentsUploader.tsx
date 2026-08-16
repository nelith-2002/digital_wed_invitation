"use client";

import Image from "next/image";
import IconixCodeCredit from "@/components/common/IconixCodeCredit";

import {
  ChangeEvent,
  DragEvent,
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
const SMALL_FILE_CHUNK_SIZE = DRIVE_CHUNK_UNIT;
const MEDIUM_FILE_CHUNK_SIZE = 2 * DRIVE_CHUNK_UNIT;
const LARGE_FILE_CHUNK_SIZE = 8 * DRIVE_CHUNK_UNIT;

const MAX_RETRIES = 3;
const COMPLETION_VISIBLE_MS = 650;

function getChunkSize(fileSize: number) {
  if (fileSize <= 4 * 1024 * 1024) {
    return SMALL_FILE_CHUNK_SIZE;
  }

  if (fileSize <= 32 * 1024 * 1024) {
    return MEDIUM_FILE_CHUNK_SIZE;
  }

  return LARGE_FILE_CHUNK_SIZE;
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

  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const isWedding = event === "wedding";

  const title = isWedding
    ? "Share Our Wedding Moments"
    : "Share Our Homecoming Moments";

  const subtitle = isWedding
    ? "Help us keep the beautiful moments you captured from our wedding."
    : "Help us keep the beautiful moments you captured from our homecoming.";

  const overallProgress = useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    const totalProgress = items.reduce(
      (sum, item) => sum + item.progress,
      0
    );

    return Math.round(
      totalProgress / items.length
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
    successfulCount === items.length;

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
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...update,
            }
          : item
      )
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
            Reset the visible progress to the beginning of this
            chunk before retrying so the bar never pretends that
            unsent bytes were accepted.
          */
          const confirmedProgress =
            Math.min(
              99,
              Math.round(
                (
                  start /
                  file.size
                ) * 100
              )
            );

          updateItem(
            itemId,
            {
              progress:
                confirmedProgress,
            }
          );

          await sleep(
            700 * attempt
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
    const {
      id,
      file,
    } = item;

    updateItem(id, {
      status: "uploading",
      progress: 0,
      error: undefined,
    });

    try {
      const uploadUrl =
        await createUploadSession(
          file
        );

      let offset = 0;
      const chunkSize =
        getChunkSize(file.size);

      while (
        offset < file.size
      ) {
        const nextOffset =
          Math.min(
            offset + chunkSize,
            file.size
          );

        const result =
          await sendChunk(
            uploadUrl,
            file,
            offset,
            nextOffset,
            id
          );

        offset = nextOffset;

        /*
          A completed chunk is definitely accepted, so make sure
          progress cannot visually fall behind a confirmed chunk.
        */
        const confirmedProgress =
          Math.min(
            99,
            Math.round(
              (
                offset /
                file.size
              ) * 100
            )
          );

        updateItem(id, {
          progress:
            confirmedProgress,
        });

        if (result.complete) {
          /*
            Show a real, confirmed 100% state before changing the
            entire page to the Thank You screen. This prevents a
            small single photo from appearing to jump straight
            from 0% to success.
          */
          updateItem(id, {
            status: "uploading",
            progress: 100,
            error: undefined,
          });

          await sleep(
            COMPLETION_VISIBLE_MS
          );

          updateItem(id, {
            status: "success",
            progress: 100,
            error: undefined,
          });

          return true;
        }
      }

      throw new Error(
        "The upload finished sending, but Google Drive did not confirm the file. Please retry this file."
      );
    } catch (error) {
      let message =
        "We couldn't upload this file. Please try again.";

      if (
        typeof navigator !==
          "undefined" &&
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
      /*
        Upload files sequentially.

        This prevents one guest's phone from
        opening many large simultaneous uploads,
        which is safer on mobile connections.
      */
      for (
        const item of
        pendingItems
      ) {
        const succeeded =
          await uploadOneItem(
            item
          );

        if (!succeeded) {
          uploadFailures++;
        }
      }

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