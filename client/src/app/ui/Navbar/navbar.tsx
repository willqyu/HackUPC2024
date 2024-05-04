import Link from "next/link";

export default function Navbar() {
    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-3" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="font-bold">Seidor</span>
                    </a>
                </div>
                
                
                <div className="lg:flex lg:gap-x-12">
                    <div className="relative">
                        <Link href="/client/directory" className="mr-5 text-m font-semibold leading-6 text-gray-900">Directory</Link>
                        <Link href="/client/order" className="mr-5 text-m font-semibold leading-6 text-gray-900">Order</Link>
                        <Link href="/client/guidance" className="mr-5 text-m font-semibold leading-6 text-gray-900">Guidance</Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}