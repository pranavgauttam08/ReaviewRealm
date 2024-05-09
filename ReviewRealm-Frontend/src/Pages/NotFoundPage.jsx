import React from "react";
import darth from "/vader.png";
function NotFoundPage() {
  return (
    <div className="not-found bg-[#121212]">
      <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <div class="px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="flex flex-col mx-auto max-w-screen-sm text-center justify-center items-center">
            <h1 class="text-5xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404.
            </h1>
            <p class="mt-2 text-montserrat font-medium text-[24px] text-gray-500 dark:text-gray-400">
              These are not the pages you're looking for. Perhaps the power of
              the Force can help you find what you seek.
            </p>
            <img src={darth} alt="Darth Vader" className="w-[23vw] h-auto" />
            <p class="mb-2 text-3xl tracking-tight font-bold text-white md:text-4xl dark:text-white">
              "I find your lack of navigation disturbing."
            </p>

            <a
              href="/"
              class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm text-center dark:focus:ring-primary-900"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
