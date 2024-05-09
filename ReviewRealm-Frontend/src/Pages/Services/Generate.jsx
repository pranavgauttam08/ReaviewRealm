import { useState } from "react";
import React from "react";
import ReactWordcloud from "@cyberblast/react-wordcloud";
import svgElement from "/news.svg";
import html2canvas from "html2canvas";
import {
  Dropdown,
  TextInput,
  Badge,
  Button,
  Alert,
  Spinner,
  Card,
  Toast,
} from "flowbite-react";
import {
  HiInformationCircle,
  HiOutlineSave,
  HiOutlineRefresh,
  HiCheck,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

const Generate = () => {
  const divRef = React.useRef(null);
  const [words, setWords] = useState("");
  const [options, setOptions] = useState("");
  const [size, setSize] = useState("");
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [fileFormat, setFormat] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // setting color values
  const vibrantColors = {
    orange: "#FF851B",
    yellow: "#FFDC00",
    green: "#2ECC40",
    blue: "#0074D9",
    purple: "#B10DC9",
    pink: "#FF4136",
    teal: "#39CCCC",
    magenta: "#FF00FF",
    lime: "#01FF70",
    cyan: "#00FFFF",
    indigo: "#4B0082",
  };

  const callbacks = {
    getWordColor: (word) => {
      if (word.value < 0) {
        return "red";
      } else if (word.value > 50) {
        const colors = Object.values(vibrantColors);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return randomColor;
      } else {
        return "blue";
      }
    },
  };

  const [formData, setFormData] = useState({
    product_url: "",
    image_type: "",
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    html2canvas(divRef.current).then((canvas) => {
      const option = formData.image_type;
      if (option == "PNG") {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "download.png";
        link.href = imgData;
        link.click();
      } else if (option == "JPEG") {
        const imgData = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.download = "download.jpeg";
        link.href = imgData;
        link.click();
      } else if (option == "PDF") {
        const componentWidth = divRef.current.offsetWidth;
        const componentHeight = divRef.current.offsetHeight;
        const orientation = componentWidth >= componentHeight ? "l" : "p";
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation,
          unit: "px",
        });

        pdf.internal.pageSize.width = componentWidth;
        pdf.internal.pageSize.height = componentHeight;

        pdf.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
        pdf.save("download.pdf");
      } else {
        alert("Select a valid image format!");
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post(
        "http://localhost:8100/v1/scrape/scraper",
        {
          product_link: formData.product_url,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        //successful response
        setLoading(false);
        setModal(true);

        setOptions({
          enableTooltip: false,
          rotations: 2,
          padding: 4,
          deterministic: true,
          rotationAngles: [-90, 0],
          fontSizes: [14, 36],
          fontWeight: "black",
          fontFamily: "montserrat",
          spiral: "rectangular",
        });
        setSize([1200, 1000]);

        const words = response.data;

        setWords(words);
      })
      .catch((error) => {
        //error backend responses
        setLoading(false);
        if (error.response.status == 401) {
          setError(true);
          const msg = `${error.response.data.detail}. Going back to authentication page in 5 seconds.`;
          setErrorMessage(msg);
          localStorage.removeItem("jwt");
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          setError(true);
          if (error.message == "Network Error") {
            setErrorMessage("Server Error!");
          } else {
            setErrorMessage(error.response.data.detail);
          }
        }
      });
  };

  return (
    <div class="py-6 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
      <div class="my-[12vh] inline-flex justify-between items-center py-1 px-1 pr-4 mb-7">
        <a href="/about">
          <img src={svgElement} />
        </a>
      </div>
      <div className="flex justify-center items-center mb-[2rem]"></div>
      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="mb-4">
          <span>
            <span className="font-medium">{errorMessage} </span>
          </span>
        </Alert>
      )}
      <h1 class="mb-[12px] text-[60px] leading-[60px] pt-2 font-montserrat font-semibold tracking-normal leading-10 text-slate-100">
        PLEASE PROVIDE THE PRODUCT LINK
      </h1>

      <p class="pt-8 mt-[12px] text-[24px] leading-[36px] font-montserrat font-normal text-[#5890FF]">
        Grab the product link which can be found in the <br />
        search bar of your browser and start exploring
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-center justify-center mt-[54px]">
          {fileFormat && (
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                {formData.image_type} selected.
              </div>
              <Toast.Toggle />
            </Toast>
          )}
        </div>
        <div className="grid grid-cols-3 mt-[34px]">
          <div className="ml-[1rem] justify-self-end" dir="ltr">
            <Badge
              className="
            !w-[151px] !h-[42px] gap-[8px] py-[10px] px-[20px] pl-[2.5rem] bg-[#F3F4F6] text-[14px] items-center !text-center text-montserrat !text-normal text-[#111928] rounded-s-lg"
            >
              Amazon Link 🇮🇳
            </Badge>
          </div>
          <div>
            <TextInput
              type="product_url"
              name="product_url"
              id="product_url"
              placeholder="amazon.in"
              class="bg-[#F9FAFB] border !h-[42px] border-[#F9FAFB] text-black placeholder-grey-900 sm:text-sm block w-full p-2.5"
              value={formData.product_url}
              onChange={(event) =>
                setFormData({ ...formData, product_url: event.target.value })
              }
              required={true}
              autoComplete="off"
            />
          </div>
          <div className="justify-self-start">
            <Dropdown
              label="Select Image Type"
              dismissOnClick={true}
              id="drops"
              value={formData.image_type}
            >
              <Dropdown.Item
                onClick={() => {
                  setFormData({ ...formData, image_type: "PNG" });
                  setFormat(true);
                }}
              >
                PNG
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFormData({ ...formData, image_type: "PDF" });
                  setFormat(true);
                }}
              >
                PDF
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFormData({ ...formData, image_type: "JPEG" });
                  setFormat(true);
                }}
              >
                JPEG
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        <div className="flex mt-[42px] items-center justify-center">
          <div className="text-center">
            {!isLoading && !modal && (
              <Button
                type="submit"
                className="w-[317px] h-[58px] !bg-[#558EFF] text-[#FFFFFF]"
              >
                <span className="text-[24px] leading-[36px]">GENERATE</span>
              </Button>
            )}
            {isLoading && (
              <div className="flex flex-row gap-3 justify-center items-center">
                <Button className="px-4 py-2 !bg-[#558eff]">
                  <Spinner
                    aria-label="Loading Spinner"
                    size="xl"
                    className=""
                  />
                  <span className="pl-3 text-inter !text-[24px] !leading-[36px]">
                    Loading...
                  </span>
                </Button>
              </div>
            )}
            {modal && (
              <Card id="cardMain">
                <h5 className="text-[30px] leading-[30px] font-inter font-extrabold tracking-none text-white-900 dark:text-white">
                  <p className="text-center">
                    Here is the Generated Word Cloud
                  </p>
                </h5>

                <div ref={divRef}>
                  <p className="bg-[#fafcf8] font-inter text-[18px] leading-[27px] p-[3rem] text-[#9CA3AF] dark:text-gray-400">
                    <ReactWordcloud
                      callbacks={callbacks}
                      words={words}
                      options={options}
                      size={size}
                    />
                  </p>
                </div>
                <Button
                  className="inline-flex items-center justify-center my-5 px-5 py-3 mr-3 text-inter font-normal text-center text-white rounded-lg bg-[#558EFF] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 text-[#1E1E1E] !bg-[#558EFF]"
                  onClick={handleExport}
                >
                  <span className="text-[18px] pr-2">
                    Export Your Word Cloud
                  </span>
                  <HiOutlineSave className="mr-5 h-5 w-5" />
                </Button>
                <div className="flex flex-row justify-center items-center">
                  <div>
                    <Button onClick={handleRefresh}>
                      <HiOutlineRefresh className="mr-2 h-5 w-5" />
                      Try another product
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Generate;
