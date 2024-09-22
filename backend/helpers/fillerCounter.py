import json
statsDict = {
    "uh": 0,
    "um": 0,
    "er": 0,
    "hm": 0,
    "I guess": 0,
    "I suppose": 0,
}
extraUh = ["ah", "oh", "eh"]
def fillerCounter(answers):
    for i in statsDict:
        statsDict[i] += answers.count(i)
    for i in extraUh:
        statsDict["uh"] += answers.count(i)
    statsDict["um"] += answers.count("em")
    with open("stats.json", "w") as outfile:
        json.dump(statsDict, outfile)
