function makePaintingsArray() {
  return [
    {
      id: "1",
      name: "Painting1",
      date_created: "2016-01-16 12:00:00"
    },
    {
      id: "2",
      name: "Painting2",
      date_created: "2016-05-01 15:00:00"
    },
    {
      id: "3",
      name: "Painting3",
      date_created: "2017-02-22 12:00:00"
    }
  ];
}

function makeMaliciousPainting() {
  const maliciousPainting = {
    id: 911,
    name: "How-to"
  };
  const expectedPainting = {
    ...maliciousPainting,
    name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };
  return {
    maliciousPainting,
    expectedPainting
  };
}

module.exports = {
  makePaintingsArray,
  makeMaliciousPainting
};
