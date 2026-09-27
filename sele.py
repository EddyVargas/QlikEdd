"""Abre o melhorcambio.com em segundo plano (headless) e copia as cotações para a área de transferência."""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyperclip

MOEDAS = {
    "Dólar": "https://www.melhorcambio.com/dolar-hoje",
    "Euro": "https://www.melhorcambio.com/euro-hoje",
    "Libra": "https://www.melhorcambio.com/libra-hoje",
}


def criar_driver():
    opcoes = webdriver.ChromeOptions()
    opcoes.add_argument("--headless=new")  # segundo plano, sem abrir janela
    opcoes.add_argument("--window-size=1920,1080")
    opcoes.add_argument("--log-level=3")
    opcoes.add_experimental_option("excludeSwitches", ["enable-logging"])
    return webdriver.Chrome(options=opcoes)


def ler_cotacao(driver, nome, url):
    driver.get(url)
    bloco = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "snipet-div"))
    )
    titulo = bloco.find_element(By.TAG_NAME, "h2").text.strip()
    linhas = [titulo]
    for tr in bloco.find_elements(By.CSS_SELECTOR, "tbody tr"):
        rotulo = tr.find_element(By.CLASS_NAME, "tdhead").text.replace("\n", " ").strip()
        valor = tr.find_element(By.CLASS_NAME, "tdvalor").text.strip()
        linhas.append(f"  {rotulo}: {valor}")
    return "\n".join(linhas)


def main():
    driver = criar_driver()
    blocos = []
    try:
        for nome, url in MOEDAS.items():
            try:
                blocos.append(ler_cotacao(driver, nome, url))
            except Exception as e:
                blocos.append(f"{nome}: erro ao ler cotação ({type(e).__name__})")
    finally:
        driver.quit()

    texto = "\n\n".join(blocos)
    pyperclip.copy(texto)
    print(texto)
    print("\n>> Copiado para a área de transferência!")


if __name__ == "__main__":
    main()

import subprocess
import pyautogui
import time
from datetime import datetime

# Data de hoje no formato YYYYMMDD
data_hoje = datetime.now().strftime("%Y%m%d")

# Nome completo do arquivo
arquivo = fr"C:\Eddy\Utilities\Phyton\output\dolar\dolar{data_hoje}.txt"

# 1. Abrir Notepad
subprocess.Popen("notepad.exe")

time.sleep(2)

# 2. Colar conteúdo do clipboard
pyautogui.hotkey("ctrl", "v")

time.sleep(1)

# 3. Salvar como
pyautogui.hotkey("ctrl", "shift", "s")

time.sleep(2)

# 4. Digitar caminho
pyautogui.write(arquivo, interval=0.03)

time.sleep(1)

# 5. Salvar
pyautogui.press("enter")

time.sleep(2)

print(f"Arquivo salvo: {arquivo}")
