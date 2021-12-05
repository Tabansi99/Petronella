Data Science portion of the project
Uses association rule learning

(Work in progress. Steps are not streamlined)

Steps to run
1. Insert a list of URLS in the raw_urls.txt folder
2. Convert these only the list of 2 letter country codes
3. Run node.js cleaned_dataset.js
4. Convert the output into a tsv file (https://codebeautify.org/json-to-tsv-converter)
5. Navigate to the model (cd model/lib)
6. Run: python apyori.py -s .5 -c .5 -f tsv < NAME_OF_FILE.tsv


Output of step 6, follows this format:
Base item.
Appended item.
Support.
Confidence.
Lift.
Terms defined here (https://towardsdatascience.com/association-rules-2-aa9a77241654)


Useful links:
https://www.kaggle.com/sangwookchn/association-rule-learning-with-scikit-learn
https://codebeautify.org/json-to-tsv-converter
https://github.com/ymoch/apyori
https://towardsdatascience.com/association-rules-2-aa9a77241654

python apyori.py -s .5 -c .5 -f tsv < json-to-tsv-converter.tsv
python apyori.py -s .5 -c .5 -f tsv < cities.tsv




python apyori.py -s .5 -c .5 -f tsv < ./splits/cold.tsv > ./outputs/data_cold.tsv

