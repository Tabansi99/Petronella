import csv
arr = []
cold = []
warm = []

with open('google_forms_2.tsv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter='\t', quotechar='|')
    for row in spamreader:
        # print(row)
        e = row[1].split(",")
        # print(e)
        if len(e) >= 3:

          temp = row[2]

          if(temp == "Warm"):
            warm.append(e)
          elif temp == "Cold":
            cold.append(e)
          else:
            arr.append(e)

          print(temp)

          # arr.append(e)  
        else:
          print("useless")


print(len(arr), len(cold), len(warm))

with open('splits/normal.tsv', 'w', newline='') as f_output:
    tsv_output = csv.writer(f_output, delimiter='\t')
    for e in arr:
      tsv_output.writerow(e)

with open('splits/warm.tsv', 'w', newline='') as f_output:
    tsv_output = csv.writer(f_output, delimiter='\t')
    for e in warm:
      tsv_output.writerow(e)

with open('splits/cold.tsv', 'w', newline='') as f_output:
    tsv_output = csv.writer(f_output, delimiter='\t')
    for e in cold:
      tsv_output.writerow(e)
