from fastapi import APIRouter, Depends, Form, HTTPException, status
from concurrent.futures import ThreadPoolExecutor
import time
import random
import requests
from bs4 import BeautifulSoup
import re
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from utils import get_current_user
from models.register import registerUser
from logger import log
from googletrans import Translator
from nlp_utils import sentiment_analysis

translator = Translator()

# import pandas as pd


router = APIRouter(prefix="/v1/scrape", tags=["scraping"])

with open("user_agents.txt", "r") as f:
    user_agents = [line.strip() for line in f.readlines()]


def get_headers():
    return {
        "User-Agent": random.choice(user_agents),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Referer": "https://www.amazon.in/",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "TE": "trailers",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
    }


def scrape_reviews(product_url):
    headers = get_headers()
    response = requests.get(product_url, headers=headers, timeout=10)
    html = response.text
    soup = BeautifulSoup(html, "html.parser")
    reviews = soup.find_all("div", {"data-hook": "review"})
    result = []
    if len(reviews) != 0:
        for review in reviews:
            try:
                rating = review.find(
                    "i", {"data-hook": "review-star-rating"}
                ).text.strip()
                text = review.find("span", {"data-hook": "review-body"}).text.strip()
                result.append([rating, text])
            except:
                try:
                    rating = review.find(
                        "i", {"data-hook": "cmps-review-star-rating"}
                    ).text.strip()
                    text1 = review.find(
                        "span", {"data-hook": "review-body"}
                    ).text.strip()
                    text_trans = translator.translate(text1, dest="en").text
                    result.append([rating, text_trans])
                except AttributeError:
                    # very possibly could've got ratelimited.
                    # but can't retry cuz this scraper has to be BLAZINGLY fast!
                    msg = "Possble ratelimit.Page not scraped."
                    log.warn(msg=msg)
                    pass
    return result


async def scrape_reviews_threaded(product_url):
    start_time = time.time()
    page_urls = [
        product_url
        + f"ref=cm_cr_arp_d_paging_btm_next_{i+1}?ie=UTF8&reviewerType=all_reviews&pageNumber={i+1}"
        for i in range(1, 20)
    ]
    page_urls.append(
        product_url + f"ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"
    )
    with ThreadPoolExecutor(max_workers=50) as executor:
        reviews = list(executor.map(scrape_reviews, page_urls))
    end_time = time.time()
    print(
        f"Scraping reviews using ThreadPoolExecutor with map took {end_time - start_time:.2f} seconds"
    )
    return reviews


async def return_review_url(product_link: str):
    pattern = r"https?://(.*?)/dp/([A-Z0-9]+)"
    match = re.search(pattern, product_link)

    if match:
        domain = match.group(1)
        asin = match.group(2)
        see_all_reviews_link = f"https://{domain}/product-reviews/{asin}/"
        return see_all_reviews_link
    else:
        return False


@router.post("/scraper")
async def scrape(
    current_user: Annotated[registerUser, Depends(get_current_user)],
    product_link: str = Form(...),
):
    see_all_reviews = await return_review_url(product_link=product_link)

    if see_all_reviews:
        msg = current_user["email"] + f" is scraping " + see_all_reviews
        log.info(msg)
        reviews_threaded = await scrape_reviews_threaded(see_all_reviews)
        final = []

        for i in range(len(reviews_threaded)):
            for review in reviews_threaded[i]:
                if review in final:
                    pass
                else:
                    final.append(review)

        print(len(final))
        # df = pd.DataFrame(final, columns=["rating", "text"])
        # df.to_csv("reviewsthreaded.csv")
        words = await sentiment_analysis(final)
        return words
    else:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid Amazon link. Please put the product link correctly.",
        )
        