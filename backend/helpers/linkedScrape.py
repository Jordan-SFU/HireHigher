from linkedin_scraper import Person, actions
from selenium import webdriver
driver = webdriver.Chrome()

email = "SpecialSongHacks@gmail.com"
password = "superballs"
def ScrapeLinkedIn(text):
    try:
        actions.login(driver, email, password) # if email and password isnt given, it'll prompt in terminal
        person = Person(text, driver=driver)
        printstr = (str(person.about) if str(person.about) != "[]" else "") + " " + (str(person.experiences) if str(person.experiences) != "[]" else "") + " " +(str(person.educations) if str(person.educations) != "[]" else "")
    except:
        return("")
    return(printstr)

print(ScrapeLinkedIn("https://www.linkedin.com/in/ronniekinseymba/"))