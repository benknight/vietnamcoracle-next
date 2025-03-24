export default function DownloadGuideError({ message }: { message: string }) {
  return (
    <div className="page-wrap text-center pt-48 font-display">
      {message} Please contact admin@vietnamcoracle.com for assistance.
    </div>
  );
}
