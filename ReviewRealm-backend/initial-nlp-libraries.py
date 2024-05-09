import os
import nltk
from logger import log

curpath = os.getcwd()
curpath = curpath + "/nltk_data"
nltk.data.path.append(curpath)
msg = "Appended nltk data path to {} ".format(curpath)
log.info(msg=msg)
nltk.download("punkt", download_dir=curpath)
nltk.download("averaged_perceptron_tagger", download_dir=curpath)
nltk.download("stopwords", download_dir=curpath)
nltk.download("wordnet", download_dir=curpath)
nltk.download("vader_lexicon", download_dir=curpath)
