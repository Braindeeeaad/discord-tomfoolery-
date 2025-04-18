import numpy as np
import pandas as pd
import sigfig
from sigfig import round as siground

import warnings 
warnings.filterwarnings("ignore")

SIG_COUNT = 3

def rounder(x, sig_count=SIG_COUNT):
    if isinstance(x, np.ndarray) or isinstance(x, list):
        return np.array([siground(val, sig_count) for val in x])
    return siground(x, sig_count)

def displayData(x, y):
    x = np.array(x)
    y = np.array(y)
    mean_x = rounder(np.mean(x))
    mean_y = rounder(np.mean(y))
    data = pd.DataFrame({'x': x, 'y': y})
    display(data)
    print(f"Mean X: {mean_x}")
    print(f"Mean Y: {mean_y}\n")
    
    # Computes slope and intercept
    xy_diff_prod = rounder((x - mean_x)*(y - mean_y))
    x_diff_sqd   = rounder((x - mean_x)**2) 
    data = pd.DataFrame({'xy_diff_prod':xy_diff_prod, 'x_diff_sqd':x_diff_sqd})
    display(data)
    print()
    
    slope = rounder(np.sum(xy_diff_prod)/np.sum(x_diff_sqd))
    intercept = rounder(mean_y - slope*mean_x)
    print(f"Slope: {slope}")
    print(f"Intercept: {intercept}")
    print()
    
    # Compute residuals
    squared_resid = rounder((y - slope*x - intercept)**2)
    squared_global_resid = rounder((y - mean_y)**2)
    data = pd.DataFrame({'squared_resid':squared_resid, 'squared_global_resid':squared_global_resid})
    display(data)
    print()
    
    SS_res = rounder(np.sum(squared_resid))
    SS_tot = rounder(np.sum(squared_global_resid))
    print(f"SS_res: {SS_res}")
    print(f"SS_tot: {SS_tot}")
    print()
    
    # Computes R-square
    r_sq = rounder(1 - (SS_res / SS_tot))
    print(f"R-Square: {r_sq}")