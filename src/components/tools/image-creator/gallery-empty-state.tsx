import Image from "next/image";

export const GalleryEmptyState = () => (
  <div className="relative flex min-h-[420px] items-center justify-center p-4 sm:min-h-[460px]">
    <div className="mx-auto max-w-[24rem] text-center">
      <div className="mx-auto flex w-fit items-center justify-center rounded-[32px]">
        <div className="rounded-[26px] bg-white p-3 shadow-[0_12px_38px_rgba(255,255,255,0.3)]">
          <Image
            src="/logo.png"
            alt="Hermes logo"
            width={64}
            height={64}
            priority
            className="size-16 rounded-[20px] object-cover"
          />
        </div>
      </div>

      <p className="mt-5 text-[16px] font-black uppercase text-white">
        Your gallery will build here
      </p>

      <p className="mt-2 text-[12px] text-white/42">
        Generate images to see them appear in the gallery. Click on an image to
        download it, or hover for more options.
      </p>
    </div>
  </div>
);
