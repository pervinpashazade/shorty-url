const { ResponseDTO } = require("../../DTO/ResponseDTO");
const { createUrl } = require("../../Repository/services/shorterServices")

exports.create = async (req, res) => {

    const result = (await createUrl(req.body)).get();

    if (!result.success) {
        return res.status(result.statusCode).json(result);
    }

    try {

        return res.status(result.statusCode).json(
            new ResponseDTO(
                result.success,
                result.statusCode,
                result.message,
                null,
                {
                    url: result.data.long_url,
                    link: result.data.link,
                }
            ).get()
        );

    } catch (error) {
        console.log('create user error : ', error);
        res.status(500).json({ error: error });
    };
}

// const getList = async (req, res) => {

//     try {

//         const result = await getUserList(req.query);

//         if (result.success) {
//             return res.status(200).json(
//                 {
//                     success: true,
//                     data: result.data,
//                     page: result.page,
//                     per_page: result.per_page,
//                     total: result.total,
//                 }
//             );
//         } else {
//             return res.status(result.statusCode).json(
//                 {
//                     success: false,
//                     data: [],
//                     error: result.error
//                 }
//             );
//         }

//     } catch (error) {
//         console.log('getUserList error', error)
//         return res.status(500).json({ success: false, message: 'Server Error', error: error });
//     }
// }

// const getById = async (req, res) => {
//     if (!req.params.id) return res.status(422).json({ success: false, message: 'Id required' });
//     try {
//         const result = await getUserById(req.params.id)

//         if (!result.success) return res.status(result.statusCode).json({
//             success: false,
//             message: result.message,
//             error: result.error,
//         });

//         return res.status(200).json({ success: true, message: 'User details', data: result.data });
//     } catch (error) {
//         console.log('getUserById error', error);
//         return res.status(500).json({ success: false, message: 'Server Error!', error: error });
//     };
// }

// const updateById = async (req, res) => {
//     if (!req.params.id) return res.status(422).json({ success: false, message: 'Id required' });

//     const result = await getUserById(req.params.id);

//     if (!result.success) {
//         return res.status(result.statusCode).json({
//             success: false,
//             message: result.message,
//             error: result.error
//         });
//     }

//     const newData = await updateUserById(req.body, result.data);

//     try {
//         if (!newData?.success) {
//             return res.status(newData.statusCode).json({
//                 success: false,
//                 message: newData.message,
//                 error: newData.error,
//             });
//         }

//         return res.status(newData.statusCode).json({
//             success: true,
//             data: newData.data,
//             message: newData.message
//         });
//     } catch (error) {
//         console.log('updateById error', error);
//         return res.status(500).json({ success: false, message: 'Server Error!', error: error });
//     }
// }

// const deleteById = async (req, res) => {
//     if (!req.params.id) return res.status(422).json({ success: false, message: 'Id required' });

//     const result = await getUserById(req.params.id);

//     if (!result.success) {
//         return res.status(result.statusCode).json({
//             success: false,
//             message: result.message,
//             error: result.error
//         });
//     }

//     const newData = await deleteUserById(req.params.id);

//     try {
//         if (!newData?.success) {
//             return res.status(newData.statusCode).json({
//                 success: false,
//                 message: newData.message,
//                 error: newData.error,
//             });
//         }

//         return res.status(newData.statusCode).json({
//             success: true,
//             data: newData.data,
//             message: newData.message
//         });
//     } catch (error) {
//         console.log('deleteById error', error);
//         return res.status(500).json({ success: false, message: 'Server Error!', error: error });
//     }
// }