Trying `electron-forge` and `electron-builder`

This is from https://www.electronjs.org/docs/tutorial/quick-start

Installed `electron-builder`:
```
npm i -D electron-builer
```

**Use electron-builder:**
* **This one works**
* puts the output in `/dist/`
```
npm run dist
```

Use electron-forge:
* Doesn't create a `dmg` file
* puts the output in `/out/`
```
npm run make
```

------------------------------------------

## Package things
```
$ npm run dist
```

## develop locally
```
$ npm run tron
```

--------------------------------------

Electron doesn't really have routes, but the routes work in here because we
listen for 'click' events and get the href from the link address

-----------------------------------

## some choices
We're using the same caps & shs as the main ssb network, because that way we can re-use the existing pubs. However, we use a specific 'post type' string in the messages that is only shown by this client.



--------------------------------------------


## how to get a list of pubs?
How do you get a list of pubs that you know about, and their connection state?
