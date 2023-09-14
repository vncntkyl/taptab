export const textTheme = {
  field: {
    input: {
      colors: {
        gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-secondary focus:ring-secondary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-secondary dark:focus:ring-secondary",
      },
      withAddon: {
        off: "rounded-sm",
      },
    },
  },
};
export const selectTheme = {
  field: {
    select: {
      base: "w-full",
      colors: {
        gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-secondary focus:ring-secondary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-secondary dark:focus:ring-secondary",
      },
      withAddon: {
        off: "rounded-sm",
      },
    },
  },
};
export const mainButton = {
  base: "group flex h-min items-center justify-center text-center font-semibold relative focus:z-10 focus:outline-none bg-main text-white",
};
export const redMainButton = {
  base: "group flex h-min items-center justify-center text-center font-semibold relative focus:z-10 focus:outline-none bg-c-red text-white",
};
export const lightButton = {
  base: "group flex h-min items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none shadow-md text-main border border-main hover:bg-main hover:text-white",
  inner: {
    base: "flex items-center gap-2",
  },
};

export const iconButton = {
  base: "group flex h-min items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none",
};
export const modalTheme = {
  root: {
    base: "animate-fade z-50",
    show: {
      on: "flex bg-black bg-opacity-20 dark:bg-opacity-80",
    },
  },
  content: {
    base: "relative h-auto w-full p-4",
  },
};
