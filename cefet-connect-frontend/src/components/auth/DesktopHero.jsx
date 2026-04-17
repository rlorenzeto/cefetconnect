import BrandLogo from "./BrandLogo";
import FeatureCard from "./FeatureCard";

export default function DesktopHero() {
  return (
    <section className="hidden border-r border-[#9bd665] lg:flex lg:h-screen lg:flex-col lg:justify-between lg:px-10 lg:pt-8 lg:pb-6">      
      <div className="mt-0">
        <BrandLogo className="h-32 w-auto object-contain xl:h-28" />
      </div>

      <div className="relative mx-auto mt-1 w-full max-w-190 h-85 xl:h-97.5 items-start justify-center">
        <div className="absolute left-0 top-4 w-55 -rotate-[8deg]">
          <FeatureCard
            title="Comunidades"
            description="Faça parte de comunidades ativas !"
            image="../../../public/images/comunidades.png"
          />
        </div>

        <div className="absolute left-87.5 top-0 z-20 w-60 rotate-6">
          <FeatureCard
            title="Dúvidas"
            description="Fique informado sobre qualquer assunto"
            image="../../../public/images/duvidas.png"
          />
        </div>
        <div className="absolute left-36.25 top-47.5 w-75">
          <FeatureCard
            title="Eventos"
            description="Esteja por dentro de todos os eventos que vão acontecer"
            image="../../../public/images/eventos.png"
          />
        </div>

        <div className="h-90 w-full" />
      </div>

      <div className="max-w-107.5">
        <h1 className="text-[56px] leading-[1.02] tracking-[-0.03em] text-black">
          Se <span className="text-[#86cf4f]">connect</span> com
          <br />
          o seu <span className="text-[#2d67c5]">campus</span>
        </h1>
      </div>
    </section>
  );
}