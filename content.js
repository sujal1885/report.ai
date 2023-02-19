var theText = ''; // initialize theText to an empty string
var to_select = ["p", "h1", "h2", "h3", "h5", "h6"];
to_select.forEach((t) => {
  selected = document.querySelectorAll(t);
  selected.forEach((s) => {
    theText += s.innerText;
  });
});

var word_count = theText.split(" ").length;

function wordFreq(string) {
  var words = string.replace(/[.]/g, "").split(/\s/);
  var freqMap = {};
  words.forEach(function (w) {
    if (!freqMap[w]) {
      freqMap[w] = 0;
    }
    freqMap[w] += 1;
  });

  return freqMap;
}

var freqMap = wordFreq(theText);

let data = { text_data: theText };

fetch("http://127.0.0.1:5000/summarize", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // removed this since this is not needed in the content script
  },
  body: JSON.stringify(data),
})
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    summary = json.summary;
    freq_word = json.freq_word;

    page_meta = {
      freq_word: freq_word,
      summary: summary,
    };

    chrome.storage.local.set({ key: page_meta });
  })
  .catch((error) => {
    console.error("Error:", error);
  });


common_words = [
  "i",
  "-",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "you're",
  "you've",
  "you'll",
  "you'd",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "she's",
  "her",
  "hers",
  "herself",
  "it",
  "it's",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "that'll",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "don't",
  "should",
  "should've",
  "now",
  "d",
  "ll",
  "m",
  "o",
  "re",
  "ve",
  "y",
  "ain",
  "aren",
  "aren't",
  "couldn",
  "couldn't",
  "didn",
  "didn't",
  "doesn",
  "doesn't",
  "hadn",
  "hadn't",
  "hasn",
  "hasn't",
  "haven",
  "haven't",
  "isn",
  "isn't",
  "ma",
  "mightn",
  "mightn't",
  "mustn",
  "mustn't",
  "needn",
  "needn't",
  "shan",
  "shan't",
  "shouldn",
  "shouldn't",
  "wasn",
  "wasn't",
  "weren",
  "weren't",
  "won",
  "won't",
  "wouldn",
  "wouldn't",
  "always",
  "already",
  "would",
  "without",
];

let sorted_Map = [];
for (var word in freqMap) {
  sorted_Map.push([word, freqMap[word]]);
}

sorted_Map.sort(function (a, b) {
  return b[1] - a[1];
});

var most_common = [];

sorted_Map.forEach((t) => {
  if (!common_words.includes(t[0].toLowerCase()) && t[0].length > 4) {
    most_common.push(t[0]);
  }
});

var freq_word = most_common.slice(0, 10); // use slice instead of a for loop to get the first 10 elements

console.log(freq_word);
console.log(summary);