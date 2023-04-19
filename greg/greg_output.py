with open('/home/carlos/calendar/calendar_cleaned.md') as f:
    lines = f.readlines()
    count = 0
    for line in lines:
        if("###" in line):
            sexyline = line[:-1] + "**"
            goodline = sexyline.replace("###", "**")
            print(goodline)
        else:
            print(line)
        count += 1


