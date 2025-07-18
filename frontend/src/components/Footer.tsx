import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-16 border-t border-gray-200">
      <div className="container mx-auto max-w-screen-xl px-4 text-center text-gray-600 text-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8">
          <Link href="#" className="hover:text-orange-600 transition-colors">
            About Us
          </Link>
          <Link href="#" className="hover:text-orange-600 transition-colors">
            Contact
          </Link>
          <Link href="#" className="hover:text-orange-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-orange-600 transition-colors">
            Terms of Service
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} NextGen Food Court. All rights reserved.</p>
      </div>
    </footer>
  )
}
