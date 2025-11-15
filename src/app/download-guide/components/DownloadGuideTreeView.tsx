'use client';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface File {
  name: string;
  key: string;
}

interface DownloadGuideTreeViewProps {
  groups: { [key: string]: File[] };
  isTest: boolean;
  paymentIntentId: string;
}

export default function DownloadGuideTreeView({
  groups,
  isTest,
  paymentIntentId,
}: DownloadGuideTreeViewProps) {
  return (
    <SimpleTreeView
      className="bg-black/5 dark:bg-white/5 rounded py-2 from-black/0 to-black/0 bg-[length:100%_4rem] bg-[repeating-linear-gradient(transparent,transparent_2rem,theme(colors.black/5%)_2rem,theme(colors.black/5%)_4rem)] dark:bg-[repeating-linear-gradient(transparent,transparent_2rem,theme(colors.white/5%)_2rem,theme(colors.white/5%)_4rem)]"
      aria-label="file system navigator">
      {Object.keys(groups).map(prefix => {
        const sortedFiles = groups[prefix].sort(sortFiles);
        const guideName =
          prefix === 'Offline Maps How-to Guide.pdf'
            ? 'Offline Maps How-to Guide'
            : sortedFiles[0].name.replace('.pdf', '');

        const pdfFiles = sortedFiles.filter(file => isPdf(file.name));
        const mapFiles = sortedFiles.filter(
          file => isKmz(file.name) || isGpx(file.name),
        );
        const gpxFiles = mapFiles.filter(file => isGpx(file.name));
        const kmzFiles = mapFiles.filter(file => isKmz(file.name));

        return (
          <TreeItem
            key={prefix}
            itemId={prefix}
            label={guideName}
            className="text-lg font-medium !font-sans">
            {pdfFiles.map(file => {
              const urlParams = new URLSearchParams({
                file_key: file.key,
                is_test: isTest ? '1' : '0',
                pi: paymentIntentId,
              });
              return (
                <TreeItem
                  key={file.name}
                  itemId={`${file.key}-item`} // Unique itemId
                  label={
                    <a
                      className="hover:underline"
                      href={`/api/download-link?${urlParams.toString()}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      {file.name}
                    </a>
                  }
                />
              );
            })}
            {mapFiles.length > 0 && (
              <TreeItem
                key={`${prefix}-map-files`}
                itemId={`${prefix}-map-files`}
                label="Map Files">
                {kmzFiles.length > 0 && (
                  <TreeItem
                    key={`${prefix}-map-files-kmz`}
                    itemId={`${prefix}-map-files-kmz`}
                    label="KMZ">
                    {kmzFiles.map(file => {
                      const urlParams = new URLSearchParams({
                        file_key: file.key,
                        is_test: isTest ? '1' : '0',
                        pi: paymentIntentId,
                      });
                      return (
                        <TreeItem
                          key={file.name}
                          itemId={`${file.key}-item`} // Unique itemId
                          label={
                            <a
                              className="hover:underline"
                              href={`/api/download-link?${urlParams.toString()}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              {file.name}
                            </a>
                          }
                        />
                      );
                    })}
                  </TreeItem>
                )}
                {gpxFiles.length > 0 && (
                  <TreeItem
                    key={`${prefix}-map-files-gpx`}
                    itemId={`${prefix}-map-files-gpx`}
                    label="GPX">
                    {gpxFiles.map(file => {
                      const urlParams = new URLSearchParams({
                        file_key: file.key,
                        is_test: isTest ? '1' : '0',
                        pi: paymentIntentId,
                      });
                      return (
                        <TreeItem
                          key={file.name}
                          itemId={`${file.key}-item`} // Unique itemId
                          label={
                            <a
                              className="hover:underline"
                              href={`/api/download-link?${urlParams.toString()}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              {file.name}
                            </a>
                          }
                        />
                      );
                    })}
                  </TreeItem>
                )}
              </TreeItem>
            )}
          </TreeItem>
        );
      })}
    </SimpleTreeView>
  );
}
function isPdf(name: string) {
  return name.toLowerCase().endsWith('.pdf');
}

function isKmz(name: string) {
  return name.toLowerCase().endsWith('.kmz');
}

function isGpx(name: string) {
  return name.toLowerCase().endsWith('.gpx');
}

function sortFiles(a: File, b: File) {
  const aPrefix = a.key.split('/')[0];
  const bPrefix = b.key.split('/')[0];

  if (aPrefix !== bPrefix) {
    return aPrefix.localeCompare(bPrefix);
  }

  // Assign a priority to each file type: PDF (0), KMZ (1), GPX (2), others (3)
  const getPriority = (name: string) =>
    isPdf(name) ? 0 : isKmz(name) ? 1 : isGpx(name) ? 2 : 3;

  const priorityDiff = getPriority(a.name) - getPriority(b.name);

  if (priorityDiff !== 0) return priorityDiff;

  return a.name.localeCompare(b.name);
}
