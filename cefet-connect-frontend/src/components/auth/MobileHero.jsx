import BrandLogo from "./BrandLogo";
import FeatureCard from "./FeatureCard";
import AuthButton from "./AuthButton";

export default function MobileHero({ onOpenLogin, onOpenRegister }) {
  return (
    <section className="lg:hidden">
      <div className="min-h-screen w-full bg-[#f4f4f4]">
        <div className="h-55 w-full overflow-hidden">
          <img
            src="/images/campus-cefet.png"
            alt="Estudantes no campus"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative -mt-6 rounded-t-[30px] bg-[#f4f4f4] px-4 pb-8 pt-5">
          <div className="mb-4 flex justify-center">
            <BrandLogo className="h-40 w-auto object-contain" />
          </div>

          <h1 className="mb-6 text-center text-[32px] leading-[1.05] tracking-[-0.03em] text-black">
            Se <span className="text-[#86cf4f]">connect</span>
            <br />
            com o seu
            <br />
            <span className="text-[#2d67c5]">campus</span>
          </h1>

          <div className="space-y-4">
            <FeatureCard
              title="Comunidades"
              description="Faça parte de comunidades ativas !"
              image="/images/comunidades.png"
            />

            <FeatureCard
              title="Dúvidas"
              description="Fique informado sobre qualquer assunto"
              image="/images/duvidas.png"
            />

            <FeatureCard
              title="Eventos"
              description="Esteja por dentro de todos os eventos que vão acontecer"
              image="/images/eventos.png"
            />
          </div>

          <AuthButton
            type="button"
            onClick={onOpenLogin}
            className="mt-6 h-11 text-sm"
          >
            Entrar
          </AuthButton>

          <AuthButton
            type="button"
            variant="outline"
            onClick={onOpenRegister}
            className="mt-3 h-11 text-sm"
          >
            Criar nova conta
          </AuthButton>
        </div>
      </div>
    </section>
  );
}