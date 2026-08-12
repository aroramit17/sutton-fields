// Vision extraction over several screenshots can take well beyond the default
// serverless timeout; server actions invoked from this segment inherit this.
export const maxDuration = 60;

export default function TiplineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
