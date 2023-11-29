import Image from "next/image";

export default function Loading() {
    return (
        <section className="flex flex-col items-center justify-center h-full gap-2">
            <p>A map is loading...</p>
            <Image src="/loading.svg" alt="Loading" width={50} height={50} className="animate-spin" />
        </section>
    );
}
