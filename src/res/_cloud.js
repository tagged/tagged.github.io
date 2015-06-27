//Sample files, by folder

module.exports = [
  {
    name: 'Dropbox',
    isFolder: true,
    contents: [
      {
        isFolder: false,
        name: 'Getting Started.pdf',
        path: ['Dropbox'],
        modified: '2010 Sep 16',
        size: '124 kB',
        type: 'PDF',
        cloud: 'Dropbox',
        link: '//www.dropbox.com/home',
        tags: [],
      },
      {
        name: 'Public',
        isFolder: true,
        contents: [
          {
            isFolder: false,
            name: 'How to use the public folder.rtf',
            path: ['Dropbox','Public'],
            modified: '2010 Sep 16',
            size: '1.05 kB',
            type: 'RTF',
            cloud: 'Dropbox',
            link: '//www.dropbox.com/home',
            tags: [],
          }
        ]
      },
      {
        name: 'Samples',
        isFolder: true,
        contents: [
          {
            name: 'Photos',
            isFolder: true,
            contents: [
              {
                isFolder: false,
                name: 'hawaii-1.jpg',
                path: ['Dropbox','Samples','Photos'],
                modified: '2013 Mar 12',
                size: '4.92 MB',
                type: 'JPG',
                cloud: 'Dropbox',
                link: '//www.dropbox.com/home',
                tags: ['Hawaii','vacation','photo'],
              },
              {
                isFolder: false,
                name: 'hawaii-2.jpg',
                path: ['Dropbox','Samples','Photos'],
                modified: '2013 Mar 12',
                size: '3.78 MB',
                type: 'JPG',
                cloud: 'Dropbox',
                link: '//www.dropbox.com/home',
                tags: ['Hawaii','vacation','photo','beach'],
              },
              {
                isFolder: false,
                name: 'hawaii-3.jpg',
                path: ['Dropbox','Samples','Photos'],
                modified: '2013 Mar 13',
                size: '5.21 MB',
                type: 'JPG',
                cloud: 'Dropbox',
                link: '//www.dropbox.com/home',
                tags: ['Hawaii','vacation','photo','luau'],
              }
            ]
          },
          {
            name: 'Recipes',
            isFolder: true,
            contents: [
              {
                isFolder: false,
                name: 'spicy pork bulgogi',
                path: ['Dropbox','Samples','Recipes'],
                modified: '2014 Aug 12',
                size: '255 B',
                type: 'FILE',
                cloud: 'Dropbox',
                link: '//www.dropbox.com/home',
                tags: ['pork','spicy','recipe'],
              },
              {
                isFolder: false,
                name: 'banana cheesecake',
                path: ['Dropbox','Samples','Recipes'],
                modified: '2013 May 20',
                size: '749 B',
                type: 'FILE',
                cloud: 'Dropbox',
                link: '//dropbox.com/home',
                tags: ['recipe','banana','dessert','cheesecake']
              },
              {
                isFolder: false,
                name: 'char siu',
                path: ['Dropbox','Samples','Recipes'],
                modified: '2015 Feb 28',
                size: '25 kB',
                type: 'PDF',
                cloud: 'Dropbox',
                link: '//www.dropbox.com/home',
                tags: ['pork','honey','five spice','recipe'],
              },
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Google Drive',
    isFolder: true,
    contents: [
      {
        isFolder: false,
        name: 'pork ribs',
        path: ['Google Drive'],
        modified: '2014 Aug 12',
        size: '184 B',
        type: 'FILE',
        cloud: 'Google Drive',
        link: '//drive.google.com',
        tags: ['pork','honey','vinegar','ribs','recipe'],
      },
      {
        isFolder: false,
        name: 'lab5.xlsx',
        path: ['Google Drive'],
        modified: '2011 Oct 6',
        size: '15.01 kB',
        type: 'XLSX',
        cloud: 'Google Drive',
        link: '//drive.google.com',
        tags: ['school','assignment']
      },
      {
        isFolder: false,
        name: 'HW-3',
        path: ['Google Drive'],
        modified: '2010 Jan 17',
        size: '290 kB',
        type: 'FILE',
        cloud: 'Google Drive',
        link: '//drive.google.com',
        tags: ['school','homework','assignment']
      },
      {
        isFolder: false,
        name: 'apartment-list.xls',
        path: ['Google Drive'],
        modified: '2009 Aug 18',
        size: '20.93 kB',
        type: 'XLS',
        cloud: 'Google Drive',
        link: '//drive.google.com',
        tags: ['school','housing']
      },
      {
        isFolder: false,
        name: 'Banana ice cream',
        path: ['Google Drive'],
        modified: '2013 Apr 2',
        size: '551 B',
        type: 'TXT',
        cloud: 'Google Drive',
        link: '//drive.google.com',
        tags: ['recipe','ice cream','dessert','banana']
      },
      {
        isFolder: true,
        name: 'Other',
        contents: [
          {
            isFolder: false,
            name: 'come-fly-with-me.mp3',
            path: ['Google Drive', 'Other'],
            modified: '2011 May 11',
            size: '4.19 MB',
            type: 'MP3',
            cloud: 'Google Drive',
            link: '//drive.google.com',
            tags: ['music']
          }
        ]
      }
    ]
  }
];
