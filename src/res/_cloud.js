module.exports = [
  {
    name: 'Dropbox',
    isFolder: true,
    contents: [
      {
        name: 'Apps',
        isFolder: true,
        contents: []
      },
      {
        name: 'Samples',
        isFolder: true,
        contents: [
          {
            isFolder: false,
            id: '20123',
            name: 'Getting Started',
            size: '2.5 KB',
            modified: '2015 Aug 28',
            type: 'PDF',
            tags: ['basic']
          },
          {
            name: 'Recipes',
            isFolder: true,
            contents: [
              {
                isFolder: false,
                id: '20188',
                name: 'char siu',
                size: '5.9 KB',
                modified: '2012 Aug 28',
                type: 'PDF',
                tags: ['basic']
              },
              {
                isFolder: false,
                id: '83748',
                name: "pork ribs",
                modified: "2014 Aug 12",
                size: "2.1 KB",
                type: "DOCX",
                tags: ["pork","ribs","honey","vinegar"],
              },
              {
                isFolder: false,
                id: "37428",
                name: "Spicy pork bulgogi",
                modified: "2014 Aug 12",
                size: "2 KB",
                type: "DOCX",
                tags: ["gochujang","gochugaru","pork","pork shoulder","spicy"],
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Google Drive',
    isFolder: true,
    contents: []
  }
];
