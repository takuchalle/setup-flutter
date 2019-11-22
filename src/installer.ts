export function getFlutter(milliseconds: number) {
    return new Promise((resolve) => {
        if (isNaN(milliseconds)) { 
            throw new Error('milleseconds not a number'); 
        }

        setTimeout(() => resolve("done!"), milliseconds)
    });
}
  