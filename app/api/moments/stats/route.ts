import {
  NextResponse,
} from "next/server";

import {
  getGoogleDriveClient,
} from "@/lib/googleDrive";

type MomentsEventStats = {
  totalFiles: number;
  photos: number;
  videos: number;
  otherFiles: number;
  storageBytes: number;
  latestUpload: string | null;
};

type DriveFileForStats = {
  id?: string | null;
  mimeType?: string | null;
  size?: string | null;
  createdTime?: string | null;
  modifiedTime?: string | null;
};

const emptyStats =
  (): MomentsEventStats => ({
    totalFiles: 0,
    photos: 0,
    videos: 0,
    otherFiles: 0,
    storageBytes: 0,
    latestUpload: null,
  });

function isPhoto(
  mimeType:
    | string
    | null
    | undefined
) {
  return Boolean(
    mimeType?.startsWith(
      "image/"
    )
  );
}

function isVideo(
  mimeType:
    | string
    | null
    | undefined
) {
  return Boolean(
    mimeType?.startsWith(
      "video/"
    )
  );
}

function getNewestDate(
  current:
    | string
    | null,
  candidate:
    | string
    | null
    | undefined
) {
  if (!candidate) {
    return current;
  }

  if (!current) {
    return candidate;
  }

  const currentTime =
    new Date(
      current
    ).getTime();

  const candidateTime =
    new Date(
      candidate
    ).getTime();

  if (
    Number.isNaN(
      candidateTime
    )
  ) {
    return current;
  }

  if (
    Number.isNaN(
      currentTime
    )
  ) {
    return candidate;
  }

  return candidateTime >
    currentTime
    ? candidate
    : current;
}

async function getFolderStats(
  folderId: string
): Promise<MomentsEventStats> {
  const drive =
    getGoogleDriveClient();

  const stats =
    emptyStats();

  let pageToken:
    | string
    | undefined;

  do {
    const response =
      await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,

        spaces:
          "drive",

        fields:
          "nextPageToken, files(id,mimeType,size,createdTime,modifiedTime)",

        pageSize: 1000,

        pageToken,
      });

    const files =
      (response.data.files ??
        []) as DriveFileForStats[];

    for (
      const file of files
    ) {
      /*
        Ignore folders if someone manually creates
        one inside Wedding/Homecoming later.
      */
      if (
        file.mimeType ===
        "application/vnd.google-apps.folder"
      ) {
        continue;
      }

      stats.totalFiles +=
        1;

      if (
        isPhoto(
          file.mimeType
        )
      ) {
        stats.photos +=
          1;
      } else if (
        isVideo(
          file.mimeType
        )
      ) {
        stats.videos +=
          1;
      } else {
        stats.otherFiles +=
          1;
      }

      const parsedSize =
        Number(
          file.size ?? 0
        );

      if (
        Number.isFinite(
          parsedSize
        ) &&
        parsedSize > 0
      ) {
        stats.storageBytes +=
          parsedSize;
      }

      stats.latestUpload =
        getNewestDate(
          stats.latestUpload,
          file.createdTime ??
            file.modifiedTime
        );
    }

    pageToken =
      response.data
        .nextPageToken ??
      undefined;
  } while (pageToken);

  return stats;
}

function combineStats(
  wedding:
    MomentsEventStats,
  homecoming:
    MomentsEventStats
): MomentsEventStats {
  return {
    totalFiles:
      wedding.totalFiles +
      homecoming.totalFiles,

    photos:
      wedding.photos +
      homecoming.photos,

    videos:
      wedding.videos +
      homecoming.videos,

    otherFiles:
      wedding.otherFiles +
      homecoming.otherFiles,

    storageBytes:
      wedding.storageBytes +
      homecoming.storageBytes,

    latestUpload:
      getNewestDate(
        wedding.latestUpload,
        homecoming.latestUpload
      ),
  };
}

export async function GET() {
  try {
    const weddingFolderId =
      process.env
        .GOOGLE_DRIVE_WEDDING_FOLDER_ID;

    const homecomingFolderId =
      process.env
        .GOOGLE_DRIVE_HOMECOMING_FOLDER_ID;

    if (
      !weddingFolderId ||
      !homecomingFolderId
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Moments Drive folders are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const [
      wedding,
      homecoming,
    ] =
      await Promise.all([
        getFolderStats(
          weddingFolderId
        ),

        getFolderStats(
          homecomingFolderId
        ),
      ]);

    const overall =
      combineStats(
        wedding,
        homecoming
      );

    return NextResponse.json(
      {
        success: true,

        stats: {
          wedding,
          homecoming,
          overall,
        },
      },
      {
        headers: {
          /*
            The dashboard already refreshes every
            10 seconds, so don't let a CDN/browser
            return stale analytics.
          */
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Moments analytics error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to load Moments analytics right now.",
      },
      {
        status: 500,
      }
    );
  }
}