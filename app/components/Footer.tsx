import Image from 'next/image';
import { IoLogoWhatsapp, IoLogoFacebook, IoLogoInstagram } from 'react-icons/io5';
const Logo = '/assets/logo-Photoroom.png';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            {/* WhatsApp */}
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3 flex-shrink-0">
                <IoLogoWhatsapp className="w-8 h-8 text-neutral-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Telepone</h3>
                <a
                  href="https://wa.me/6281238836006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +62 812 3883 6006
                </a>
              </div>
            </div>

            {/* Facebook */}
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3 flex-shrink-0">
                <IoLogoFacebook className="w-8 h-8 text-neutral-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Facebook</h3>
                <a
                  href="https://web.facebook.com/ayu.hanum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ayu.hanum
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3 flex-shrink-0">
                <IoLogoInstagram className="w-8 h-8 text-neutral-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Instagram</h3>
                <a
                  href="https://www.instagram.com/oppie.pie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  @oppie.pie
                </a>
              </div>
            </div>
          </div>

          {/* Right: Logo + Operational Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <Image
                src={Logo}
                alt="Oppie Pie Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm md:text-base">
              <div>
                <h3 className="font-semibold mb-1">Jam Operasional:</h3>
                <p className="text-gray-300">09.00 – 20.00 WIB</p>
              </div>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  Klipang Pesona Asri 3 Blk. B No.66,<br />
                  Sendangmulyo, Kec. Tembalang,<br />
                  Kota Semarang, Jawa Tengah 50272
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-gray-800 text-sm">
            © 2020 Oppie Pie. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}