import time
import pyautogui

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# ---------------------------------------
# 1. ABRIR CHROME COM SELENIUM
# ---------------------------------------

#options = Options()
#options.add_experimental_option("detach", True)

#driver = webdriver.Chrome(options=options)

#driver.maximize_window()
#driver.get("https://www.youtube.com/shorts/DYICWiHgptk")

# Aguardar carregamento
time.sleep(1)

#pyautogui.click(800, 300, duration=1)

# ---------------------------------------
# 3. LOOP DE 5000 REPETIÇÕES
# ---------------------------------------

for i in range(0, 5000):

    # 4. SCROLLBAR 20 PARA BAIXO
    #pyautogui.scroll(-20)
    pyautogui.click(1000, 500, duration=1)
    time.sleep(3)    
    pyautogui.click(1200, 600, duration=1)
    time.sleep(3)
    pyautogui.hotkey('alt', 'space')
    time.sleep(.5)
    pyautogui.press('x')
    time.sleep(3)
    pyautogui.click(1100, 50, duration=1)
    time.sleep(3)
    #pyautogui.click(1250, 10, duration=1)
    pyautogui.moveTo(1000, 10, duration=0.5)
    time.sleep(1)
    pyautogui.dragTo(400, 10, duration=1, button='left')
    time.sleep(3)
    pyautogui.click(430,590, duration=1)
    time.sleep(3)
    print(f"Repetição: {i + 1}/5000")

print("Finalizado!")