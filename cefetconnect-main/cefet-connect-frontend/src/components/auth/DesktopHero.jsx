import BrandLogo from "./BrandLogo";
import FeatureCard from "./FeatureCard";

export default function DesktopHero() {
  return (
    <section className="hidden border-r border-[#9bd665] bg-[#f4f4f4] lg:flex lg:min-h-screen lg:flex-col lg:px-8 lg:pt-8 lg:pb-8 xl:px-10">
      <div className="shrink-0">
        <BrandLogo className="h-24 w-auto object-contain xl:h-28" />
      </div>

      <div className="relative mx-auto mt-6 h-85 w-full max-w-155 xl:h-97.5 xl:max-w-175">
        <div className="absolute left-[2%] top-[10%] w-[32%] min-w-45 max-w-55 -rotate-[8deg]">
          <FeatureCard
            title="Comunidades"
            description="Faça parte de comunidades ativas !"
            image="/images/comunidades.png"
          />
        </div>

        <div className="absolute right-[4%] top-[2%] z-20 w-[34%] min-w-47.5 max-w-60 rotate-6">
          <FeatureCard
            title="Dúvidas"
            description="Fique informado sobre qualquer assunto"
            image="/images/duvidas.png"
          />
        </div>

        <div className="absolute left-1/2 top-[48%] w-[40%] min-w-55 max-w-75 -translate-x-1/2">
          <FeatureCard
            title="Eventos"
            description="Esteja por dentro de todos os eventos que vão acontecer"
            image="/images/eventos.png"
          />
        </div>
      </div>

      <div className="mt-8 max-w-140 xl:mt-10">
        <h1 className="text-[clamp(42px,5vw,56px)] leading-[1.02] tracking-[-0.03em] text-black">
          Se <span className="text-[#86cf4f]">connect</span> com
          <br />
          o seu <span className="text-[#2d67c5]">campus</span>
        </h1>
      </div>
    </section>
  );
}