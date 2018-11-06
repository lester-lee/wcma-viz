# Image processing imports
import cv2
import numpy as np
from scipy.stats import itemfreq
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from scipy import stats

COLOR_DELIMITER = "$"
DETAILS_FILENAME = "data/collection-color-details.csv"

# Split delimited hexes string and convert to RGB tuples
def convert_hex2rgb(hexes):
  hex_list = hexes.split(COLOR_DELIMITER)
  return [tuple(int(h.lstrip("#")[i:i+2], 16) for i in (0, 2, 4))
          for h in hex_list]

# Turn list of RGB into delimited string of color hexes
def convert_rgb2hex(rgbs):
  hex = [f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}" for rgb in rgbs]
  return COLOR_DELIMITER.join(hex)

# Quantize RGB array into n colors and return those colors as hex string
def get_dominant_colors(n, arr):
  # Define k-means hyperparameters
  criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
  flags = cv2.KMEANS_RANDOM_CENTERS
  ret, label, centers = cv2.kmeans(arr, n, None, criteria, 10, flags)

  # Convert back to uint8
  centers = np.uint8(centers)
  return convert_rgb2hex(centers)

'''
  Load the color details and parse for relevant info,
  and then process and print that information.
'''

with open(DETAILS_FILENAME, 'r') as f:
  data = [x.rstrip() for x in f]

colors = []
lights = []
contrasts = []

for x in data:
  info = x.split(',')
  colors += convert_hex2rgb(info[1])
  lights.append(info[2])
  contrasts.append(info[3])

colors = np.float32(colors)
lights = np.float32(lights)
contrasts = np.float32(contrasts)

print(get_dominant_colors(10, colors))

sns.violinplot(data=lights)
plt.title("Violin Plot of Luminance Values")
plt.show()

sns.violinplot(data=contrasts)
plt.title("Violin Plot of Contrast Values")
plt.show()
