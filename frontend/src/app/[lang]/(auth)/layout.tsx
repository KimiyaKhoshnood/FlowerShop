export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page grid min-h-[75vh] items-center gap-12 py-12 lg:grid-cols-2">
      <div className="relative hidden h-full min-h-[520px] overflow-hidden rounded-[2rem] bg-blush lg:block">
        <div className="absolute inset-0 bg-[url(/VerticalHeroBg.svg)] bg-cover bg-center opacity-70" />
        <img src="/Flower13MothOrchid.svg" alt="" className="absolute inset-x-0 bottom-0 mx-auto h-4/5 object-contain" />
      </div>
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
}
