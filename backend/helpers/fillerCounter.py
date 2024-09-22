
def fillerCounter(answers):
    statsDict = {
    "uh": 0,
    "um": 0,
    "er": 0,
    "hm": 0,
    "I guess": 0,
    "I suppose": 0,
    }
    extraUh = ["ah", "oh", "eh"]

    for i in statsDict:
        statsDict[i] += answers.count(i)
    for i in extraUh:
        statsDict["uh"] += answers.count(i)
    statsDict["um"] += answers.count("em")
    return statsDict
