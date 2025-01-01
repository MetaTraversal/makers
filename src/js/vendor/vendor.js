let vendorz = {"ad":'345'};

// console.log(vendorz)
function mandelbrot(cX, cY, maxIter) {
    let zX = 0;
    let zY = 0;
    let n = 0;
    
    while (zX * zX + zY * zY <= 4 && n < maxIter) {
      const tempX = zX * zX - zY * zY + cX;
      zY = 2 * zX * zY + cY;
      zX = tempX;
      n++;
    }
    
    return n;
  }