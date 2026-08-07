import Image from "next/image";
import { clients } from "@/lib/content";

export function CustomerMarquee() {
  const repeatedClients = [...clients, ...clients];

  return (
    <div className="overflow-hidden border-y border-primary/10 bg-white py-7">
      <div className="marquee-pause flex w-max animate-marquee gap-4">
        {repeatedClients.map((client, index) => (
          <div
            key={`${client.name}-${index}`}
            className={`flex h-20 w-64 shrink-0 items-center gap-4 border px-5 ${
              client.logoVariant === "dark"
                ? "border-transparent bg-[#005f8f]"
                : "border-primary/10 bg-bgLight"
            }`}
            aria-hidden={index >= clients.length}
          >
            {client.logoSrc ? (
              <Image
                src={client.logoSrc}
                alt={client.name}
                width={213}
                height={48}
                className={`h-12 w-full object-contain ${
                  client.logoVariant === "dark" ? "p-1" : ""
                }`}
              />
            ) : (
              <>
                <span className="grid h-12 w-12 shrink-0 place-items-center bg-primary font-headline text-xl font-semibold text-white">
                  {client.initials}
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
                  {client.name}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
