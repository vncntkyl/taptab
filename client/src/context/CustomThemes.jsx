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
export const bottomOnlyBorderText = {
  field: {
    input: {
      colors: {
        gray: "transition-all bg-transparent ring-none outline-none focus:outline-none border-t-0 border-l-0 border-r-0 border-b-2 border-b-gray-300 text-gray-900 focus:border-b-light focus:ring-0",
      },
      withAddon: {
        off: "rounded-sm",
      },
    },
  },
};
export const textareaTheme = {
  base: "block w-full rounded-sm border disabled:cursor-not-allowed disabled:opacity-50 text-sm",
  colors: {
    gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-secondary focus:ring-secondary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-secondary dark:focus:ring-secondary",
  },
};
export const bottomOnlyBorderParagraph = {
  base: "transition-all block w-full rounded-sm border-t-0 border-l-0 border-r-0 border-b-2 border-b-light outline-none ring-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
  colors: {
    gray: "bg-transparent border-gray-300 text-gray-900 focus:border-b-light focus:ring-0",
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
  size: {
    xs: "text-xs p-1",
    sm: "text-sm p-1.5",
  },
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
export const tabTheme = {
  tablist: {
    tabitem: {
      base: "flex items-center justify-center p-2 px-3 text-xs text-main uppercase font-black disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 border-r-2 border-default last:border-none",
      styles: {
        default: {
          base: "rounded-none",
          active: {
            on: "text-secondary-dark",
            off: "",
          },
        },
      },
    },
  },
  tabpanel: "w-full overflow-x-auto shadow-md rounded-md",
};
