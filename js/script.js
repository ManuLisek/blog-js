'use strict';

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.authors.list',
  article: {
    selector: '.post',
    tagsSelector: '.post-tags .list',
    authorSelector: '.post-author',
  },
  selector: {
    article: '.post',
    title: '.post-title',
    titleList: '.titles',
    articleTags: '.post-tags .list',
    articleAuthor: '.post-author',
    tagList: '.tag.list',
    authorsList: '..authors.list',
  },
  title: {
    selector: '.post-title',
    listSelector: '.titles',
  },
  author: {
    articleSelector: '.post-author',
    listSelector: '.authors.list',
  },
  cloud: {
    classCount: 5,
    classPrefix: 'tag-size-',
  },
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetSelector = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetSelector.classList.add('active');
}

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  let html = '';
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTML = `<li><a href="#${articleId}"><span> ${articleTitle} </span></a></li>`;
    /* insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    min: 99999,
    max: 0,
  };
  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);
  return (opts.cloudClassPrefix + classNumber);
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.articleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const dataTags = article.getAttribute('data-tags');
    /* split tags into array */
    const dataTagsArray = dataTags.split(' ');
    /* START LOOP: for each tag */
    for (let dataTag of dataTagsArray) {
      /* generate HTML of the link <li><a href="#">code</a></li>*/
      const linkHTML = `<li><a href="#tag-${dataTag}">${dataTag}</a></li>`;
      /* add generated code to html variable */
      html += linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(dataTag)) {
        /* [NEW] add generated code to allTags object */
        allTags[dataTag] = 1;
      } else {
        allTags[dataTag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  /* [NEW] add html from allTags to tagList */
  // tagList.innerHTML = allTags.join(' ');
  const tagsParams = calculateTagsParams(allTags);
  /*[NEW] create variable for all links HTML code*/
  let allTagsHTML = '';
  /* [NEW] START LOOP: ofr each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsHTML += `<li class=${calculateTagClass(allTags[tag], tagsParams)}><a href="#tag-${tag}">${tag}(${allTags[tag]})</a></li>`;
    /* [NEW] END LOOP: for each tag in allTags: */
  }
  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const activeTagLinkCandidates = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let activeTagLinkCandidate of activeTagLinkCandidates) {
    /* add class active */
    activeTagLinkCandidate.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href*="tag"]');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();


function generateAuthors() {
  /* create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find authors wrapper */
    const authorsWrapper = article.querySelector(opts.articleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get authors from data-authors attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link */
    const linkHTML = `<a href="#author-${articleAuthor}">by ${articleAuthor}</a>`;
    /* add generated code to html variable */
    html += linkHTML;
    /* check if this link is NOT already in allAuthors */
    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      /* add generated code to allAuthors array */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* insert HTML of all the links into the authors wrapper */
    authorsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* find list of authors in right column */
  const authorList = document.querySelector(opts.authorsListSelector);
  /* create variable for all links HTML code */
  let allAuthorsHTML = '';
  /* START LOOP for each author in authorList */
  for (let author in allAuthors) {
    /* generate code of link and add it to allAuthorsHTML */
    allAuthorsHTML += `<li><a href="#author-${author}">${author}(${allAuthors[author]})</a></li>`;
    /* END LOOP for each author in authorList */
  }
  /* add html from allAuthorsHTML to authorList */
  authorList.innerHTML = allAuthorsHTML;
}

generateAuthors();


function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all tag links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const activeAuthorLinkCandidates = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let activeAuthorLinkCandidate of activeAuthorLinkCandidates) {
    /* add class active */
    activeAuthorLinkCandidate.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  /* find all links to tags */
  const authorLinks = document.querySelectorAll('a[href*="author"]');
  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {
    /* add tagClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();