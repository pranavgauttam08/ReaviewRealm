import pandas as pd
import re
import nltk
import os
import time

curpath = os.getcwd()
curpath = curpath + "/nltk_data"
nltk.data.path.append(curpath)

from nltk.corpus import stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from rake_nltk import Rake
from collections import defaultdict


# important configs
r = Rake(
    min_length=3,
    max_length=4,
    stopwords=stopwords.words("english"),
    punctuations=[")", "(", ",", ":", "),", ").", "."],
)
pos_dict = {"J": "A"}
sia = SentimentIntensityAnalyzer()
pos = {"1": 10, "2": 8, "3": 6, "4": 4, "5": 2}
neg = {"1": 2, "2": 4, "3": 6, "4": 8, "5": 10}


def preprocess(data):
    data["text"] = data["text"].fillna("")  # replace null values with empty string

    data["text"] = data["text"].apply(
        lambda x: "" if not isinstance(x, str) else x
    )  # replace non-string values with empty string
    return data


def extract_keywords(text):
    r.extract_keywords_from_text(text)
    return r.get_ranked_phrases()


def clean(text):
    text = re.sub("[^a-zA-Z0-9]", " ", text)  # Removes special characters
    text = text.lower()  # Converts to lowercase
    text = re.sub("\s+", " ", text)  # Remove extra whitespace
    return text


def tokenize_text(text):
    # tokenization
    tokens = nltk.word_tokenize(text)
    return tokens


def pos_tag(tokens):
    # POS tagging
    tagged_tokens = nltk.pos_tag(tokens)
    return tagged_tokens


def token_stop_adjectives(text):
    # extracting keywords from the Cleaned Reviews such that the adjective is followed by a noun
    tags = pos_tag(tokenize_text(text))
    newlist = []
    for i in range(len(tags) - 1):
        word, tag = tags[i]
        if word not in set(stopwords.words("english")) and tag[0] in pos_dict:
            if tags[i + 1][1][0] == "N":
                newlist.append((word + " " + tags[i + 1][0]))
        elif word not in set(stopwords.words("english")) and tag[0] not in pos_dict:
            continue
    return newlist


async def sentiment_analysis(array):
    start_time = time.time()
    for i in range(len(array)):
        array[i][0] = array[i][0][0]
    data = pd.DataFrame(array, columns=["rating", "text"])
    rating = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
    rating_order = data["rating"].value_counts().to_dict()
    rating.update(rating_order)
    data = preprocess(data)

    # keyword extraction
    data["keywords"] = data["text"].apply(extract_keywords)
    # cleaning
    data["Cleaned Reviews"] = data["text"].apply(clean)
    # POS tagging
    data["POS tagged"] = data["Cleaned Reviews"].apply(token_stop_adjectives)

    # real sentiment analysis code. Too sleepy to convert to a function. TO-DO
    word_scores = defaultdict(list)
    for sentence in data["POS tagged"]:
        for word in sentence:
            scores = sia.polarity_scores(word)
            word_scores[word].append(scores["compound"])

    for sentence in data["keywords"]:
        for word in sentence:
            scores = sia.polarity_scores(word)
            word_scores[word].append(scores["compound"])

    # positive and negative words
    positive_words = sorted(
        word_scores, key=lambda w: max(word_scores[w]), reverse=True
    )[:50]

    negative_words = sorted(word_scores, key=lambda w: min(word_scores[w]))[:50]

    # algorithm to calculate the number of positive and negative words to be returned on the basis of the Ratings
    # assigning weights
    count_pos = 0

    count_neg = 0

    for key in rating:
        count_pos += round(rating[key] / pos[key])
        count_neg += round(rating[key] / neg[key])

    # generating an array of product's features
    p = 0
    n = 0
    returnwords = []
    for word in positive_words:
        if p < count_pos and max(word_scores[word]) > 0.5:
            returnwords.append(
                {"text": clean(word), "value": round(max(word_scores[word]) * 100, 2)}
            )
            p = p + 1
        else:
            break

    for word in negative_words:
        if n < count_neg:
            returnwords.append(
                {"text": clean(word), "value": round(min(word_scores[word]) * 100, 2)}
            )
            n = n + 1
        else:
            break

    end_time = time.time()
    print(f"Review Sentiment Analysis took {end_time - start_time:.2f} seconds")
    return returnwords
