import numpy as np

def normal(mu, sigma, counts):
    np.random.seed(0)
    s = np.random.normal(mu, sigma, counts)
    return s