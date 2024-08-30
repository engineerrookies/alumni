import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import logoImage from "@/assets/logo.jpg";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center text-x1 font-bold text-primary">
          <Image
            src={logoImage}
            alt="SDD Alumni Logo"
            width={35}
            height={35}
            className="mr-2"
          />
          Alumni!
        </Link>
        <div className="flex items-center gap-4"></div>
          <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}