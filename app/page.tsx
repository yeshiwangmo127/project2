'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CursorSlider from './component/slider';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#7ea6f7" }}>
      {/* External slider component */}
      <CursorSlider />

      {/* For You Section */}
      <section className="flex flex-col items-center py-8 sm:py-12">
        <div className="bg-white bg-opacity-70 rounded-3xl shadow-lg p-4 sm:p-10 w-full max-w-md sm:max-w-4xl flex flex-col items-center">
          <img
            src="/images/medicalhis.jpg"
            alt="History"
            className="rounded-3xl mb-4 sm:mb-6 w-full sm:w-[500px] h-40 sm:h-[250px] object-cover shadow-lg"
            style={{ objectFit: 'cover' }}
          />
          <h2 className="text-2xl sm:text-5xl font-light mb-2 sm:mb-4 text-center">For You</h2>
          <p className="text-base sm:text-xl text-center mb-4 sm:mb-6">
            Precision in Practice. Dedication in Duty.<br />
            Your Health, Our Mission. Your Recovery, Our Passion.<br />
            Excellence in Care. Innovation in Treatment. Hope in Every Heartbeat.<br />
            Empowering Health with Science and Soul.
          </p>
          <Link
            href="/about"
            className="btn btn-outline-dark px-4 sm:px-6 py-2 text-base sm:text-lg rounded-lg border-2 border-black font-medium hover:bg-black hover:text-white transition"
          >
            About Us
          </Link>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-8 sm:py-12 flex flex-col items-center">
        <div className="bg-white bg-opacity-70 rounded-3xl shadow-lg p-4 sm:p-10 w-full max-w-lg sm:max-w-6xl flex flex-col items-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 text-center">Reserve an Appointment with us</h1>
          <h2 className="text-xl sm:text-3xl font-light mb-4 sm:mb-10 text-center">Services Offered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 w-full">
            {[
              ['anesthesiology.jpg', 'Anesthesiology'],
              ['cardiology.jpg', 'Cardiology'],
              ['opthalmology.jpg', 'Opthalmology'],
              ['dentist.jpg', 'Dentistry'],
            ].map(([img, title]) => (
              <Link href="/book" key={title} className="flex flex-col items-center">
                <img
                  src={`/images/${img}`}
                  alt={title}
                  className="rounded-full mb-2 sm:mb-4 w-40 sm:w-72 h-40 sm:h-72 object-cover border-4 border-blue-200 shadow-lg"
                  style={{ aspectRatio: '1/1' }}
                />
                <h3 className="text-lg sm:text-2xl font-semibold text-center">{title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Medical Center */}
      <section className="py-8 sm:py-12 flex flex-col items-center">
        <div className="bg-white bg-opacity-70 rounded-3xl shadow-lg p-4 sm:p-10 w-full max-w-lg sm:max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center">
          <img
            src="/images/med.jpg"
            alt="Medical Center"
            className="rounded-3xl w-full h-40 sm:h-[300px] object-cover shadow-lg"
          />
          <div className="flex flex-col items-center">
            <h2 className="text-2xl sm:text-5xl font-light mb-2 sm:mb-4 text-center">Our Medical Center</h2>
            <p className="mb-4 sm:mb-6 text-base sm:text-xl text-center">
              Where health meets excellence! We specialize in enhancing your health with luxurious treatments and personalized services.
              Healthcare is not just about treating illnesses — it's about restoring hope, nurturing lives, and building healthier communities.
            </p>
            <div className="mt-2 sm:mt-4 flex gap-1 sm:gap-2 justify-center flex-nowrap flex-wrap">
              {[
                { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/PurePathMedical' },
                { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/PurePathMedical' },
                { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/purepathmedical' },
                { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/purepathmedical' },
              ].map(({ name, icon, url }) => (
                <a
                  href={url}
                  key={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 border-2 border-black rounded-lg text-xs font-medium hover:bg-black hover:text-white transition"
                >
                  <i className={`bi bi-${icon} text-base`}></i>
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact-us" className="py-8 sm:py-12 flex flex-col items-center">
        <div className="bg-white bg-opacity-70 rounded-3xl shadow-lg p-4 sm:p-10 w-full max-w-lg sm:max-w-6xl flex flex-col items-center">
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Location</h2>
          <a
            href="https://www.google.com/maps/place/California,+USA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="max-w-lg mx-auto">
              <img src="/images/cqal.png" alt="Map" className="w-full h-64 object-cover rounded-2xl shadow-lg" />
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
