describe('basicMEAN - basic non logged-in view verification', function () {

    beforeEach(function () {
        browser.get('http://localhost:3000');
    });

    it('should contain 2 public view links on the navbar', function () {
        let publicViews = element.all(by.repeater('view in navbar.data.left.public'));
        expect(publicViews.count()).toEqual(2);
    });

    it('should have view 1 as the active view after initial load', function () {
        let publicViews = element.all(by.repeater('view in navbar.data.left.public'));
        // ensure that view1 was the first and active view in the list
        let firstView = publicViews.get(0);
        expect(firstView.getText()).toEqual('View 1');
        expect(firstView.getAttribute('class')).toEqual('active');
    });

    // TODO: complete spec-ing out the initial view tests

});