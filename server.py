import pandas as pd
from nltk.corpus import stopwords
import re
import string
from nltk.tokenize import word_tokenize
import nltk
import fasttext
nltk.download('stopwords')

class LoadData:
    def readData(loc):
        data = pd.read_csv(loc)
        return data
    def saveData( loc, data, file_name):
        data.to_csv(loc+file_name, index=False)
        return loc+file_name

class Preprocessing:
    def cleaning(review):
        review = str(review).lower()
        review = str(review).encode('ascii', 'replace').decode('ascii')
        review = ' '.join(re.sub("([@#][A-Za-z0-9]+)|(\w+:\/\/\S+)"," ", review).split())
        review = re.sub(r'https?:\/\/.\S+', "", review)                     # remove url
        review = re.sub(r"\d+", "", review)                                 # remove number
        review = review.translate(str.maketrans("","",string.punctuation))  # remove tanda baca/punctuation
        review = review.strip()                       # remove whitespace in the first and end of string
        review = re.sub('\s+',' ',review)             # replace any kind of whitespace to regular space
        review = re.sub(r"\b[a-zA-Z]\b", "", review)  # remove all char
        review = word_tokenize(review)
        return review

    def gabung(review):
        return " ".join(review)

    def stopwords_removal(words):
        list_stopwords = stopwords.words('indonesian')
        list_stopwords.extend(["yg", "dg", "rt", "dgn", "ny", "d", 'klo','iya','yah','iyah',
                       'kalo', 'amp', 'biar', 'bikin', 'bilang','udc','kok','mimin','min',
                       'gak', 'ga', 'krn', 'nya', 'nih', 'sih', 'nder','eh', 'lho',
                       'si', 'tau', 'tdk', 'tuh', 'utk', 'ya', 'gini', 'gitu',
                       'jd', 'jgn', 'sdh', 'aja', 'nyg', 'hehe', 'pen', 'u', 'nan', 'loh', 'rt',
                       '&amp', 'yah','ude','udd','ud','uc','ub','ubd','uae',
                       'udca','udffb','udd','udca','udca','ude','uded','ucd',
                       'uca','ubb','udfe','u','uac','ub','ubd','ubb','ubf','uba',
                       'uad','uae','ub','uce','opel','bb','cd','ca','db','bc','dd',
                       'ded','de','fa','ee','bf','fc','eb','dec','cb','fb','ff','ce','cf','fbc','dc',
                       'ed','af','bb','ca','db','bc','ded','nan','df',
                       'dfa','wkwk','wkwkwkwkwk','dh','dda','deb','def','duank','donk','dong','doank',
                       'nder','dca','kpn','fef','kyk','gini','cmn','pgn','halo','hai','hay','wow','haa','xixixi','hey',
                       'sta','crf','dee','iy','ni','la','ae','aa','ngemper','ea','nsmr','wkwkwk','edc',
                       'fd','go','sns','sh','ba', 'yans', 'ec', 'ds','ddd','cdgw','my','nt','ba','fbf','ad','fe','ef',
                       'ec','ab','ehtml','html','bfcm','cbb','cbfcm','ab','fcamp','dce','yrl','yth','kn','dcd','ueueueue',
                       'dcdgw','dehh', 'an','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u',
                       'v','w','x','y','z','in','btw','sry','ac','bd','cc','be','yuk','we','re','yuk','yuuukk','oi','eh',
                       'lapef','weh','wih','wii','wkakwkakwkk','wkawkawk','ya','yuks','ywda','yukk','hayu','\n','hehehe'])

        txt_stopword = pd.read_csv("/home/niahizkia/projects/SSA/static/file/stopwords.csv", names= ["stopwords"], header = None)
        list_stopwords.extend(txt_stopword["stopwords"][0].split(' '))
        # convert list to dictionary
        list_stopwords = set(list_stopwords)
        return [word for word in words if word not in list_stopwords]

    def normalisasi(document):
        normalized_word = pd.read_excel("/home/niahizkia/projects/SSA/static/file/normalisasi.xlsx")
        normalized_word_dict = {}
        for index, row in normalized_word.iterrows():   #.iterrows() method generates an iterator object of the DataFrame, to iterate each row in the DataFrame
            if row[0] not in normalized_word_dict:
                normalized_word_dict[row[0]] = row[1]
        return [normalized_word_dict[term] if term in normalized_word_dict else term for term in document]

class Fasttext:
    def train(loc):
        model = fasttext.train_supervised(input=loc, lr=0.1, wordNgrams=3, epoch=5)
        filename = 'static/file/model/finalized_model.bin'
        model.save_model(filename)
        return "model has been saved"

    def predict(row):
        model = Fasttext.loadmodel('finalized_model.bin')
        return model.predict(row['review'])

    def predict_sentence(sentence):
        model = Fasttext.loadmodel('finalized_model.bin')
        return model.predict(sentence)

    def test(loc,model):
        testing = model.test(loc)
        return testing        

    def loadmodel(loc):
        filename = 'static/file/model/'+loc
        loaded_model = fasttext.load_model(filename)
        return loaded_model