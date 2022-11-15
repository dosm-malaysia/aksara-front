import Button from "@components/Button";
import Dropdown from "@components/Dropdown";
import { DocumentDuplicateIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import julia from "highlight.js/lib/languages/julia";
import r from "highlight.js/lib/languages/r";
import "highlight.js/styles/shades-of-purple.css";
import { OptionType } from "@components/types";
import { copyClipboard } from "@lib/helpers";

interface CodeBlockProps {
  code?: Record<string, string>;
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({
  code = {
    python: `# Note: Don’t forget to activate your venv
# If not already installed, do: pip install pandas tabulate

import pandas as pd
import json
from tabulate import tabulate
import pydosm

URL_DATA = 'https://storage.googleapis.com/economy-public/gdp_gni_constant_prices.parquet'
URL_METADATA = 'https://storage.googleapis.com/economy-public/gdp_gni_constant_prices_metadata.json'

df_meta = json.loads(URL_METADATA)
df = pd.read_parquet(URL_DATA)

print(df_meta)`,
    julia: `### Types
struct Plus
    f::typeof(+)
end

mutable struct Mut
    mutable::A          # mutable should not be highlighted (not followed by struct)
    primitive::B        # primitive should not be highlighted (not followed by type)
end

primitive type Prim 8 end

abstract type Abstr end

### Miscellaneous

# Some things new for Julia >1.0
function f(x::Union{String,Missing,Nothing}, y::Tuple{Float64,ComplexF64})
    if x === nothing
        println(devnull, "nothing")
    elseif x === missing
        println(stderr, "missing")
    else
        println(stdout, x)
    end
end

f(x::UndefInitializer = undef) = Regex("^hello, world\$")

# where, infix isa, UnionAll
function F{T}(x::T) where T
    for i in x
        i isa UnionAll && return
    end
end
`,
    r: `require(stats)

#' Compute different averages
#'
#' @param x \code{numeric} vector of sample data
#' @param type \code{character} vector of length 1 specifying the average type
#' @return \code{centre} returns the sample average according to the chosen method.
#' @examples
#' centre(rcauchy(10), "mean")
#' @export
centre <- function(x, type) {
  switch(type,
         mean = mean(x),
         median = median(x),
         trimmed = mean(x, trim = .1))
}
x <- rcauchy(10)
centre(x, "mean")

library(ggplot2)

models <- tibble::tribble(
  ~model_name,    ~ formula,
  "length-width", Sepal.Length ~ Petal.Width + Petal.Length,
  "interaction",  Sepal.Length ~ Petal.Width * Petal.Length
)  
`,
  },
}) => {
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("julia", julia);
  hljs.registerLanguage("r", r);

  const languageOptions: OptionType[] = [
    {
      label: "Python",
      value: "python",
    },
    {
      label: "Julia",
      value: "julia",
    },
    {
      label: "R",
      value: "r",
    },
  ];
  const [language, setLanguage] = useState<OptionType>(languageOptions[0]);
  const [copyText, setCopyText] = useState<string>("Copy");

  const handleCopy = () => {
    copyClipboard(code[language.value]);
    setCopyText("Copied!");
    setTimeout(() => {
      setCopyText("Copy");
    }, 1000);
  };
  return (
    <div className="rounded-xl bg-black ">
      <div className="flex justify-between border-b border-outline border-opacity-20 p-2.5 text-white">
        <Dropdown
          darkMode
          sublabel={<GlobeAltIcon className="mr-2 h-4 w-4" />}
          options={languageOptions}
          selected={language}
          onChange={e => setLanguage(e)}
        />
        <Button
          className="text-sm text-dim hover:bg-washed/10"
          icon={<DocumentDuplicateIcon className="h-4 w-4" />}
          onClick={handleCopy}
        >
          {copyText}
        </Button>
      </div>
      <div className="p-4.5 text-xs">
        <code
          className="whitespace-pre text-white"
          dangerouslySetInnerHTML={{
            __html: hljs.highlight(code[language.value], { language: language.value }).value,
          }}
        />
      </div>
    </div>
  );
};

export default CodeBlock;
