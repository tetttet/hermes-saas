import Link from "next/link";
import { LockIcon } from "@/components/icons/image-creator-icons";

type LockedDemoPageProps = {
  title: string;
  description: string;
};

const LockedDemoPage = ({ title, description }: LockedDemoPageProps) => (
  <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-[#141414] px-4 py-10 text-white sm:px-6">
    <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-[#191a1d] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.34)] sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_42%)]" />

      <div className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white/72">
          Demo
        </span>

        <div className="mt-6 flex size-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.045] text-[#8fbdff] shadow-[0_16px_46px_rgba(37,99,235,0.14)]">
          <LockIcon className="size-9" />
        </div>

        <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-white/58 sm:text-[15px]">
          {description}
        </p>

        <Link
          href="/image"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-bold text-[#141414] transition hover:bg-white/90"
        >
          Open image studio
        </Link>
      </div>
    </div>
  </section>
);

export default LockedDemoPage;
