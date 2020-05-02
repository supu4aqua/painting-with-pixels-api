function makeCellsArray() {
  return [
      {
        "id": "1",
        "paintingid": "1",
        "position": "1",
        "color": "red"
    },
      {
        "id": "2",
        "paintingid": "1",
        "position": "2",
        "color": "blue"
        },
      {
        "id": "3",
        "paintingid": "1",
        "position": "3",
        "color": "black"
      },
      {
        "id": "4",
        "paintingid": "1",
        "position": "4",
        "color": "green"
        },
      {
        "id": "5",
        "paintingid": "1",
        "position": "5",
        "color": "white"
        },
      {
        "id": "6",
        "paintingid": "1",
        "position": "6",
        "color": "blue"
        },
      {
        "id": "7",
        "paintingid": "1",
        "position": "7",
        "color": "black"
      },
      {
        "id": "8",
        "paintingid": "1",
        "position": "8",
        "color": "yellow"
        },
      {
        "id": "9",
        "paintingid": "1",
        "position": "9",
        "color": "red"
      }
    ];
}

function makeMaliciousCell() {
  const maliciousCell = {
    id: 911,
    name: 'How-to',
  }
  const expectedCell = {
    ...maliciousCell,
   name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
  }
  return {
    maliciousCell,
    expectedCell,
  }
}

module.exports = {
  makeCellsArray,
  makeMaliciousCell,
}
