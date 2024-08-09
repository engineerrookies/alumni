import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import logoImage from "@/assets/logo.jpg";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="flex items-center text-x1 font-bold text-primary">
          <Image
            src={logoImage} // Path to your logo image in the public directory
            alt="SDD Alumni Logo"
            width={35} // Adjust width as needed
            height={35} // Adjust height as needed
            className="mr-1" // Optional: margin-right to add space between logo and text
          />
          Alumni!
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}