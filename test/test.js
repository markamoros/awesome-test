import server from "../bin/www.js";
import chai from "chai";
import chaiHttp from "chai-http";

chai.should();
chai.use(chaiHttp);

let sentenceId;

const sentence = {
    text: "Test text",
    category: "tech"
}

describe('Test API', () => {

    describe('POST /sentence', () => {
        it('should post a sentence instance', (done) => {
            chai.request(server)
                .post("/sentence")
                .send(sentence)
                .set('Authorization', 'BsNae57Es6N')
                .end((err, res) => {
                    res.should.have.status(200);
                    sentenceId = res.body.id;
                    res.body.id.should.be.a("string");
                    done();
                });
        });
    });

    describe('GET /sentence/:id', () => {
        it('should get a sentence instance', (done) => {
            chai.request(server)
                .get("/sentence/" + sentenceId)
                .set('Authorization', 'BsNae57Es6N')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.text.should.be.eq(sentence.text);
                    res.body.category.should.be.eq(sentence.category);
                    done();
                });
        });
    });

    describe('UPDATE /sentence', () => {
        it('should update a sentence instance', (done) => {
            chai.request(server)
                .put("/sentence/" + sentenceId)
                .send({ category: "soft" })
                .set('Authorization', 'BsNae57Es6N')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.category.should.be.eq("soft");
                    done();
                });
        });
    });

    describe('DELETE /sentence', () => {
        it('should update a sentence instance', (done) => {
            chai.request(server)
                .delete("/sentence/" + sentenceId)
                .set('Authorization', 'BsNae57Es6N')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eq("Sentence correctly deleted.");
                    done();
                });
        });
    });
});