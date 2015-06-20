//Sample files, by folder

module.exports = [
  {
    name: 'Dropbox',
    isFolder: true,
    contents: [
      {
        name: 'Apps',
        isFolder: true,
        contents: [
          {
            name: 'TaggedClouds',
            isFolder: true,
            contents: []
          }
        ]
      },
      {
        name: 'Samples',
        isFolder: true,
        contents: [
          {
            isFolder: false,
            id: '20123',
            name: 'Getting Started With a really really really really really Long Title',
            path: ['Dropbox','Samples'],
            modified: '2015 Feb 28',
            size: '25 KB',
            type: 'PDF',
            cloud: 'Dropbox',
            link: '//www.dropbox.com/home',
            tags: ['pork','pork shoulder','honey','five spice','food.ingredients.sauces.oyster','red bean paste', 'shoyu'],
          },
          {
            name: 'Recipes',
            isFolder: true,
            contents: [
              {
                isFolder: false,
                id: '83748',
                name: 'pork ribs',
                path: ['Dropbox','Samples','Recipes'],
                modified: '2014 Aug 12',
                size: '2 KB',
                type: 'DOCX',
                cloud: 'Dropbox',
                link: '//www.dropbox.com/home',
                tags: ['pork','ribs','honey','vinegar'],
              },
              {
                isFolder: false,
                id: '37428',
                name: 'Spicy pork bulgogi',
                path: ['Dropbox','Samples','Recipes'],
                modified: '2014 Aug 12',
                size: '2 KB',
                type: 'DOCX',
                cloud: 'Dropbox',
                link: '//dropbox.com/home',
                tags: ['gochujang','gochugaru','pork','pork shoulder','spicy'],
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
