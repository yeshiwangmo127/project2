import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-[#7ea6f7]">
      {/* Existing About Section */}
      <div className="container mx-auto py-8 px-2 sm:py-12 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">About Our Hospital</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-8 sm:mb-12">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-black-700 mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-black-600 mb-4 sm:mb-6 text-base sm:text-lg">
              Our mission is to provide exceptional healthcare services with compassion and care.
              We strive to be the leading healthcare provider in the region, offering cutting-edge
              medical treatments while maintaining the highest standards of patient care.
            </p>
            <p className="text-black-600 text-base sm:text-lg">
              With state-of-the-art facilities and a team of highly qualified medical professionals,
              we are committed to improving the health and well-being of our community.
            </p>
          </div>
          <div className="relative h-60 sm:h-[400px] w-full">
            <Image
              src="/images/hospital-building.webp"
              alt="Hospital Building"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {[
            {
              title: 'Our Values',
              items: ['Excellence in Healthcare', 'Patient-Centered Care', 'Integrity and Ethics', 'Continuous Innovation']
            },
            {
              title: 'Our Team',
              items: ['Expert Physicians', 'Skilled Nurses', 'Dedicated Support Staff', 'Experienced Administrators']
            },
            {
              title: 'Our Facilities',
              items: ['Modern Equipment', 'Comfortable Rooms', 'Advanced Labs', 'Emergency Services']
            }
          ].map((section, index) => (
            <div key={index} className="bg-blue-300 p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">{section.title}</h3>
              <ul className="text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base">
                {section.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-blue-300 p-4 sm:p-8 rounded-lg mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Our History</h2>
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">
            Established in 1995, our hospital has grown from a small clinic to a comprehensive
            healthcare facility. Over the years, we have continuously expanded our services and
            upgraded our facilities to meet the growing healthcare needs of our community.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            Today, we are proud to be one of the most trusted healthcare providers in the region,
            serving thousands of patients annually with our comprehensive range of medical services.
          </p>
        </div>

        {/* Medical Introduction Section */}
        <div className="text-center bg-gradient-to-b from-[#7ea6f7] to-blue-700 py-12 sm:py-24 px-2 sm:px-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            About our <span className="text-blue-700">PurePath Medical</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-4">With over 15 years of experience</p>
          <div className="mt-6 sm:mt-10 flex justify-center">
            <div className="relative w-full max-w-xl sm:max-w-4xl h-60 sm:h-[400px]">
              <Image
                src="/images/doctor1.png"
                alt="Doctor Image"
                fill
                className="object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* About Us with Team */}
        <div className="bg-blue-300 py-8 sm:py-12 px-2 sm:px-4 rounded-lg max-w-full sm:max-w-5xl mx-auto mb-8 sm:mb-12 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6">About Us</h2>
          <p className="text-gray-700 mb-2 sm:mb-4 text-sm sm:text-base">
            Welcome to our medical facility, where we prioritize your health and well-being. Our experienced team of healthcare professionals is dedicated to providing high-quality care through innovative medical practices and a compassionate approach.
          </p>
          <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
            We offer a wide range of medical services, including preventive care, diagnostics, and specialized treatments. Our goal is to empower you with the information you need to make informed decisions about your healthcare.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">Meet Our Team</h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { name: 'Dr. John Smith', role: 'Chief Medical Officer', img: 'doctor1.png' },
              { name: 'Dr. Jane Doe', role: 'Pediatric Specialist', img: 'doctor2.jpg' },
              { name: 'Dr. Emily Johnson', role: 'Cardiologist', img: 'doctor3.jpg' },
              { name: 'Dr. Choi Deok', role: 'Dentist', img: 'doctor5.jpg' },
              { name: 'Dr. Jeong Seok', role: 'Surgeon', img: 'doctor4.webp' },
              { name: 'Dr. Jonas', role: 'Dermatologist', img: 'doctor6.jpeg' }
            ].map((doc, i) => (
              <div key={i} className="bg-blue-200 p-2 sm:p-4 rounded-lg text-center w-[120px] sm:w-[180px] hover:-translate-y-1 transition-transform">
                <div className="relative w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] mx-auto mb-2">
                  <Image
                    src={`/images/${doc.img}`}
                    alt={doc.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h4 className="text-sm sm:text-md font-bold">{doc.name}</h4>
                <p className="text-xs sm:text-sm text-gray-700">{doc.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience and Reach */}
        <div className="py-8 sm:py-12 px-2 sm:px-4 bg-blue-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center max-w-full sm:max-w-6xl mx-auto">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Experience and <span className="text-blue-600">Reach</span></h2>
              <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">The medical reach experience with knowledge</p>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Physicians, scientists and other medical experts dedicate a portion of their clinical time to this site. We are in the unique position to give you access to the knowledge and experience of Medical Physicians.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-gray-700 text-xs sm:text-base">
                <div>
                  <p>✓ Scheduling patient</p>
                  <p>✓ Preparing blood sample</p>
                  <p>✓ Helping physicians</p>
                </div>
                <div>
                  <p>✓ Preparing patients</p>
                  <p>✓ Taking and recording</p>
                  <p>✓ Replacement recovery</p>
                </div>
              </div>
            </div>
            <div className="relative w-full h-40 sm:h-[300px]">
              <Image
                src="/images/expert.webp"
                alt="Doctors"
                fill
                className="object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
