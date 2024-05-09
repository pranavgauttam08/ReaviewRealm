import React from "react";
import { Label, TextInput, Checkbox, Button, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// http://127.0.0.1:8100/v1/auth/login

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = JSON.stringify(Object.fromEntries(data.entries()));
    const myObj = JSON.parse(payload);
    axios
      .post(
        "http://localhost:8100/v1/auth/login",
        {
          grant_type: "",
          username: myObj.email,
          password: myObj.password,
          scope: "",
          client_id: "",
          client_secret: "",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("jwt", response.data.access_token);
          navigate("/generate");
          window.location.reload(false);
        } else {
          throw new Error("Login failed");
        }
      })
      .catch((error) => {
        if (error.message == "Network Error") {
          setErrorMessage("Server Error!");
        } else {
          setError(true);
          setErrorMessage(
            "Login Error! Change a few things up and try submitting again."
          );
          setValues({
            email: "",
            password: "",
          });
        }
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  return (
    <div className="flex flex-row" id="auth">
      <div class="basis-8/12">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <div class="my-[20vh] inline-flex justify-between items-center py-1 px-1 pr-4 mb-7"></div>

          <h1 class="mb-[1rem] text-[60px] leading-[60px] pt-2 font-inter font-extrabold tracking-normal leading-10 text-[#FFFFFF]">
            <div class="text-left pl-[80px]">
              Log Into your
              <br /> Review<span className="text-[#558EFF]">Realm</span> account
            </div>
          </h1>
          <div>
            <p class="pt-2 mt-10 text-[20px] leading-[30px] font-inter font-normal text-[#FFFFFFCC]">
              <div className="text-left pl-[80px]">
                Empower your purchasing decisions and sales strategy with
                <br />
                <span className="text-[#558EFF]">ReviewRealm</span> - where
                product analysis meets convenience!
              </div>
            </p>
          </div>
          <p class="pt-2 mt-10 text-[18px] leading-[27px] font-inter font-normal text-left pl-[80px]">
            <a
              href="/register"
              class="inline-flex items-center text-inter font-normal text-[#558EFF] underline"
            >
              Create an account if you do not have one
              <svg
                class="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </p>
        </div>
      </div>
      <div class="basis-4/12">
        <section class="!bg-transparent">
          <div class="flex flex-col items-center justify-center px-4 py-8 mx-auto md:h-screen lg:py-0 ">
            {error && (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                className="mb-4"
              >
                <span>
                  <span className="font-medium">{errorMessage}</span>
                </span>
              </Alert>
            )}
            <div class="authbox w-full bg-[#1F2A37] rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold text-inter leading-tight tracking-tight text-[#FFFFFF] md:text-2xl dark:text-white">
                  Sign in
                </h1>
                
                <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <Label
                      htmlFor="email"
                      class="block mb-2 text-inter text-sm font-medium text-white dark:text-white"
                      value="Your email"
                    />
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      class="bg-[#4B5563] border border-[#4B5563] text-white-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="password1"
                      class="block mb-2 text-inter text-sm font-medium text-white dark:text-white"
                      value="Your password"
                    />

                    <TextInput
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      class="bg-[#4B5563] border border-[#4B5563] text-white-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={values.password}
                      onChange={handleChange}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div class="flex items-start">
                      <div className="flex items-center h-5">
                        <Checkbox id="remember" />
                      </div>
                      <div className="ml-3 text-sm">
                        <Label htmlFor="remember" className="text-white">
                          Remember me
                        </Label>
                      </div>
                    </div>
                    <a
                      href="#"
                      class="text-sm font-medium text-white hover:underline dark:text-primary-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Button
                    type="submit"
                    class="w-full text-inter text-[#1E1E1E] text-medium bg-[#558EFF] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    <span className="text-center">Login to your account</span>
                  </Button>
                  <p class="text-sm font-light text-white dark:text-gray-400">
                    Not registered yet?{" "}
                    <a
                      href="/register"
                      class="font-medium text-[#558EFF] hover:underline dark:text-primary-500"
                    >
                      Create an account
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
